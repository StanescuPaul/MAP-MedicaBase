import express from "express";
import { PrismaClient } from "@prisma/client";
import { sendSucces, sendError } from "./helper/response.js"; //am creeat 2 functii separate pentru a fi mai usor de gestionat erorile si succes-urile si pentru a fi mai consistent cu ele si mai usor de comunicat cu forntend-ul

const app = express();
const db = new PrismaClient();
const port = 3000;

app.use(express.json());

app.post("/doctor/register", async (req, res) => {
  try {
    const { name, userName, password } = req.body;

    if (!name || !userName || !password) {
      return sendError(
        res,
        "Numele,username-ul si parola sunt obligatorii",
        400
      );
    }
    if (password.length < 8) {
      return sendError(res, "Parola trebuie sa contina minim 8 caractere", 400);
    }

    const doctor = await db.doctor.create({
      data: {
        name: name,
        userName: userName,
        password: password,
      },
    });
    return sendSucces(res, doctor, 201);
  } catch (error) {
    console.log("ERROR on /doctor/register POST: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/doctor/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return sendError(res, "Username-ul si parola sunt oblivatorii", 400);
    }

    const doctor = await db.doctor.findUnique({
      where: { userName: userName },
    });

    if (!doctor) {
      return sendError(res, "Parola sau username invalide", 401);
    }

    if (doctor.password !== password) {
      return sendError(res, "Parola sau username invalide", 401);
    }

    return sendSucces(
      res,
      {
        meassage: "Autentificare reusita",
        doctor: {
          id: doctor.id,
          name: doctor.name,
          userName: doctor.userName,
        }, //creez un obiect manual ca raspuns in care trimit doar datele non-sensibile adica nu trimit si parola
      },
      200
    );
  } catch (error) {
    console.log("ERROR on /doctor/login POST: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/admin/doctors", async (req, res) => {
  try {
    const doctorList = await db.doctor.findMany();

    if (doctorList.length === 0) {
      //findManny nu returneaza null deci verificam daca lungimea e 0 atunci nu exista doctori
      return sendError(res, "Nu s-au gasit doctori", 404);
    }
    return sendSucces(res, doctorList, 200);
  } catch (error) {
    console.log("ERROR on /admin/doctors GET", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/doctor/:idDoctor/patients", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const patients = await db.patients.findMany({
      where: { doctorId: idDoctor },
      include: { alergies: true },
    });
    if (!patients) {
      return sendError(res, "Nu a fost gasit nici un pacient", 404);
    }
    return sendSucces(res, patients, 200);
  } catch (error) {
    console.log("ERROR on /doctor/patients GET: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/doctor/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idPatient } = req.params;
    const patient = await db.patients.findUnique({
      where: { id: idPatient },
      include: { alergies: true },
    });
    if (!patient) {
      return sendError(res, "Pacientul nu a fost gasit", 404);
    }
    return sendSucces(res, patient, 200);
  } catch (error) {
    console.log("ERROR on /doctor/patients/:idPatient GET: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/doctor/:idDoctor/patients", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { name, cnp, alergies } = req.body;

    if (!name || !cnp || cnp.length !== 13) {
      return sendError(
        res,
        "Numele este obligatoriu iar CNP-ul trebuie sa fie de 13 cifre",
        400
      ); //Verificare input
    }

    const existent = await db.patients.findUnique({ where: { cnp: cnp } });

    if (existent) {
      return sendError(res, "CNP-ul este asociat altui nume", 400);
    }

    const patient = await db.patients.create({
      data: {
        name: name,
        cnp: cnp,
        alergies: {
          create: alergies.map((alergie) => ({ name: alergie.name })),
        },
        doctor: { connect: { id: idDoctor } }, // conectam datele de mai sus cu doctorul cu id-ul respectiv
      },
      include: { alergies: true }, // ca raspunsul pe care il primim sa aiba si alergiile in body
    });
    return sendSucces(res, patient, 201);
  } catch (error) {
    console.log("ERROR on /doctor/:idDoctor/patients POST: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.put("/doctor/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idPatient } = req.params;
    const { alergies } = req.body;

    if (!alergies) {
      return sendError(res, "Nu sunt introduse update-uri", 400);
    }

    const patientUpdated = await db.patients.update({
      where: { id: idPatient },
      data: {
        alergies: {
          create: alergies.map((alergie) => ({ name: alergie.name })),
        },
      },
      include: { alergies: true },
    });

    return sendSucces(res, patientUpdated, 200);
  } catch (error) {
    console.log("ERROR on /doctor/:idDoctor/patients/:idPatient PUT: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/patient/login", async (req, res) => {
  try {
    const { name, cnp } = req.body;

    if (cnp.length !== 13 || !cnp) {
      return sendError(res, "CNP-ul trebuie sa fie din 13 cifre", 400);
    }

    const patient = await db.patients.findUnique({
      where: { cnp: cnp },
      include: { alergies: true },
    });

    if (!patient) {
      return sendError(
        res,
        "CNP-ul nu este bun sau nu exista pacient asociat lui",
        400
      );
    }

    if (patient.name !== name) {
      return sendError(res, "Numele nu se potriveste cu CNP-ul", 400);
    }

    return sendSucces(
      res,
      {
        patient: {
          name: name,
          cnp: cnp,
          alergies: patient.alergies.map((alergie) => ({ name: alergie.name })), // nu vreau sa returnez si idDoctor motive de securitate asa ca creez eu un obiect personalizat cu datele pe care le vreau
        },
      },
      200
    );
  } catch (error) {
    console.log("ERROR on /patient/login POST", error);
    sendError(res, "Internal server error", 500);
  }
});

app.delete("/doctor/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idDoctor, idPatient } = req.params;

    const patient = await db.patients.findUnique({
      where: { id: idPatient },
    });

    if (!patient) {
      return sendError(res, "Pacientul nu exista", 404);
    }

    if (patient.doctorId !== idDoctor) {
      return sendError(
        res,
        "Pacientul nu apartine de acest doctor prin urmare nu poate fi sters",
        400
      );
    }
    const deleteAlergies = await db.alergies.deleteMany({
      //delete many returneaza un count cu cate obiecte sunt
      where: { patientId: idPatient }, //stergem toate alergiile asociate acelui pacient
    });
    const deletedPatient = await db.patients.delete({
      where: { id: idPatient },
    });
    return sendSucces(res, { deletedPatient, deleteAlergies }, 200);
  } catch (error) {
    console.log(
      "ERROR on /doctor/:idDoctor/patients/:idPatient DELETE: ",
      error
    );
    sendError(res, "Internal server error", 500);
  }
});

app.delete("/doctor/:idDoctor", async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const doctor = await db.doctor.findUnique({
      where: { id: idDoctor },
    });

    if (!doctor) {
      return sendError(res, "Doctorul nu s-a gasit", 404);
    }

    const deletedAlergies = await db.alergies.deleteMany({
      where: { patient: { doctorId: idDoctor } },
    }); //stergem prima data alergiile corespunzatoare pacientului doctorului

    const deletedPatients = await db.patients.deleteMany({
      where: { doctorId: idDoctor },
    }); //stergem pacientii corespunzatori doctorului

    const deletedDoctor = await db.doctor.delete({
      where: { id: idDoctor },
    }); //stergem doctorul

    return sendSucces(
      res,
      { deletedDoctor, deletedPatients, deletedAlergies },
      200
    );
  } catch (error) {
    console.log("ERROR on /doctor/:idDoctor DELETE: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
