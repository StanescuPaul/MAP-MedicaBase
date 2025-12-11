import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"; // nu mergea conexiunea cu react fara
import { sendSucces, sendError } from "./helper/response.js"; //am creeat 2 functii separate pentru a fi mai usor de gestionat erorile si succes-urile si pentru a fi mai consistent cu ele si mai usor de comunicat cu forntend-ul
import "dotenv/config"; //cu noile update-uri in loc de url din schema.prisma
import multer from "multer"; // librarie pentru gestionare fisiere
import path from "path"; // pentru a lucra cu cai de fisiere
import fs from "fs/promises"; // permite lucrarea cu File Sistem-ul serverului (citire/scriere/stergere)

const app = express();
const db = new PrismaClient();
const port = 5000;

//imi gaseste calea absoluta unde ruleaza serverul (index.js)
const __dirname = path.resolve();

app.use(cors()); //am nevoie neaparat de asta pentru a putea accesa serverul
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); //express.static imi creaza un middleware care permite browser-ului sa acceseze direct directorul cu calea construita in path.join(construieste calea cu separatorul /\ in functie de sistemul de operare)
//in libraria multer, trimitand un fisier prin intermediul multer se creaza un obiect (file) cu anumite proprietati destination(calea destinatie pentru file-ul trimis), filename(numele construit de multer), originalname(numele fisierului original)

//multer.storage spune serverului sa salveze pe hardisk-ul masinii pe care ruleaza serverul poza
const storageRule = multer.diskStorage({
  //construim calea destinatie pentru imagine
  destination: (req, file, cb) => {
    //cb este functia de callback penttru cand e gata actiunea
    cb(null, path.join(__dirname, "public/uploads/doctors")); //cb returneaza null pentru nici o eroare si dupa returneaza calea destinatie
  },

  //functia pentru a crea numele fisierului
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".").pop(); // in extension salvam extensia pozei

    const { idDoctor } = req.params;

    cb(null, `${idDoctor}.${extension}`); //construim numele file-ului poza cu id-ul doctorului si extensia preluata mai sus
  },
});

//in storageRule declaram regulile pentru multer cum sa stocheze si unde sa stocheze imaginea pentru uploar care e obiectul instantat de ibraria multer
const upload = multer({
  //creez instanta multer care foloseste ce contine storage
  storage: storageRule, //storage este o proprietate pe care o cauta multer cand se ruleaza middleware-ul
});

//upload e middleware-ul rutei .single accepta doar un singur file cu filedName ul declarat din frontend single este din multer
app.post(
  "/doctors/:idDoctor/upload-photo",
  upload.single("profilePicture"), //middleware
  async (req, res) => {
    try {
      const { idDoctor } = req.params;

      if (!req.file) {
        return sendError(res, "No photo was added", 400);
      }
      //toate functiile declarate mai sus sunt folosite doar de multer si salveaza output-ul in obiectul file de aia pot accesa file.filename pentru ca sub capota multer cand a fost apelat middleware-ul a accesat automat functiile din storage urmand sa bage proprietatiile in obiectul file
      const imgUrl = `/uploads/doctors/${req.file.filename}`;

      const updateDoctor = await db.doctor.update({
        where: { id: idDoctor },
        data: { profileImgUrl: imgUrl },
      });
      //poza se salveaza in server si backend-ul trimite doar url-ul ei din server pentru a fi accesat de frontend ca o poza luata de pe google dar pin url nu descarcata pe masina ta
      return sendSucces(
        res,
        { message: "Profile picture added succesfuly", data: updateDoctor },
        200
      );
    } catch (err) {
      console.log("ERROR on /doctors/:idDoctor/upload-photo POST ", err);
      sendError(res, "Internal server error", 500);
    }
  }
);

app.post("/doctors/register", async (req, res) => {
  try {
    const { name, userName, password } = req.body;

    if (!name || !userName || !password) {
      return sendError(res, "Name, username, and password are required", 400);
    }

    const doctorUserExist = await db.doctor.findUnique({
      where: { userName: userName },
    });

    if (doctorUserExist) {
      return sendError(res, "Username is already used", 400); //error are in componenta res,message,status
    }

    if (password.length < 8) {
      return sendError(
        res,
        "The password must contain at least 8 characters",
        400
      );
    }

    const doctor = await db.doctor.create({
      data: {
        name: name,
        userName: userName,
        password: password,
      },
    });
    return sendSucces(
      //succes are in componenta res,data(care e un obiect sau nu iar de asta depinde cum se preiau datele in frontend),status
      res,
      {
        message: "Account successfully created",
        doctor,
      },
      201
    );
  } catch (error) {
    console.log("ERROR on /doctor/register POST: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/doctors/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return sendError(res, "Username and password are required", 400);
    }

    const doctor = await db.doctor.findUnique({
      where: { userName: userName },
    });

    if (!doctor) {
      return sendError(res, "Invalid password or username", 401);
    }

    if (doctor.password !== password) {
      return sendError(res, "Invalid password or username", 401);
    }

    return sendSucces(
      res,
      {
        message: "Login successful",
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

    return sendSucces(res, doctorList, 200);
  } catch (error) {
    console.log("ERROR on /admin/doctors GET", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/doctors/:idDoctor/patients", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { cnp } = req.query;

    let whereCondition = { doctorId: idDoctor }; //aici bagam id doctor la care e pacientul

    if (cnp) {
      whereCondition.cnp = cnp; //aici combinam conditiile pentru a face o interogare si pe baza de cnp
    }

    const patients = await db.patients.findMany({
      where: whereCondition,
      //nu includ si alergiile deoarece aici vreau doar sa primesc pacientii alergiile le am in ruta /:idPatient
    });

    if (cnp && patients.length === 0) {
      return sendError(res, `There is no patient with this CNP: ${cnp}`, 404); //in caz ca avem cnp si lista de pacienti e 0 atunci dam eroare pentru ca nu exista pacientul cu acel cnp
    }

    return sendSucces(res, patients, 200);
  } catch (error) {
    console.log("ERROR on /doctors/patients GET: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/doctors/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idPatient } = req.params;
    const patient = await db.patients.findUnique({
      where: { id: idPatient },
      include: { alergies: true },
    });
    if (!patient) {
      return sendError(res, "The patient was not found", 404);
    }
    return sendSucces(res, patient, 200);
  } catch (error) {
    console.log("ERROR on /doctor/patients/:idPatient GET: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/doctors/:idDoctor", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const doctor = await db.doctor.findUnique({
      where: { id: idDoctor },
      include: {
        _count: {
          //variabila numara ce ii ceri sa selecteze in cazul nostru pacientii
          select: {
            patients: true,
          },
        },
      },
    });

    if (!doctor) {
      sendError(res, "Error finding the doctor", 400);
    }

    const patientCount = doctor._count ? doctor._count.patients : 0; //daca exista doctor count atunci returnam numarul daca nu 0

    return sendSucces(
      res,
      {
        id: doctor.id,
        userName: doctor.userName,
        name: doctor.name,
        createAt: doctor.createAt,
        updateAt: doctor.updatedAt,
        patientCount: patientCount,
        profileImgUrl: doctor.profileImgUrl,
      },
      200
    );
  } catch (error) {
    console.log("ERROR on /doctors/:idDoctor GET: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/doctors/:idDoctor/patients", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { name, cnp, alergies } = req.body;

    if (!name || !cnp || cnp.length !== 13) {
      return sendError(
        res,
        "The name is required, and the CNP must be 13 digits long",
        400
      ); //Verificare input
    }

    const existent = await db.patients.findUnique({ where: { cnp: cnp } });

    if (existent) {
      return sendError(res, "The CNP is associated with another name", 400);
    }

    const patient = await db.patients.create({
      data: {
        name: name,
        cnp: cnp,
        alergies: {
          create: alergies.map((alergie) => ({ name: alergie })),
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

app.put("/doctors/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idPatient } = req.params;
    const { newAlergies, newName, newCnp } = req.body;

    if (newCnp) {
      const uniqueCnp = await db.patients.findUnique({
        where: { cnp: newCnp },
      });
      if (uniqueCnp && uniqueCnp.id !== idPatient) {
        return sendError(res, "There is a patient with this CNP", 400);
      }
    }

    if (newCnp && newCnp.length !== 13) {
      return sendError(res, "CNP must contain 13 characters", 400);
    }

    const allergiesToCreate = newAlergies.map((name) => ({ name: name })); //mapam prin alergiile primite din front-end care este un array pentru a-l convertii in obiect cu proprietatea name: care este formatul acceptat de prisma

    const updateData = {
      updateAt: new Date(),
      alergies: {
        create: allergiesToCreate,
      },
    };

    if (newName) {
      updateData.name = newName;
    }
    if (newCnp) {
      updateData.cnp = newCnp;
    }

    const patientUpdated = await db.patients.update({
      where: { id: idPatient },
      data: updateData,
      include: { alergies: true },
    });

    return sendSucces(res, patientUpdated, 200);
  } catch (error) {
    console.log("ERROR on /doctor/:idDoctor/patients/:idPatient PUT: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.put("/doctors/:idDoctor", async (req, res) => {
  try {
    const { idDoctor } = req.params;
    const { newUserName, currentPassword, newPassword, newName } = req.body;

    if (!newUserName && !newName && !newPassword) {
      return sendError(res, "There was no updates", 400);
    }

    const doctorData = await db.doctor.findUnique({ where: { id: idDoctor } });

    const updateData = {};

    if (newUserName && newUserName !== doctorData.userName) {
      updateData.userName = newUserName;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return sendError(res, "Password needs to have at least 8 characters");
      }
      if (!currentPassword || currentPassword !== doctorData.password) {
        return sendError(res, "The current password is not correct", 400);
      }
      updateData.password = newPassword;
    }

    if (newName) {
      updateData.name = newName;
    }

    const doctorUpdate = await db.doctor.update({
      where: { id: idDoctor },
      data: updateData,
    });

    sendSucces(res, doctorUpdate, 200);
  } catch (error) {
    console.log("ERROR on /doctors/:idDoctors PUT", error);
    sendError(res, "Internal server error", 500);
  }
});

app.post("/patients/login", async (req, res) => {
  //aici as schimba functii cand ajung la implementarea ei cu /patients/:idPatients si query pentru nume si cnp
  try {
    const { name, cnp } = req.body;

    if (!name) {
      return sendError(res, "The name is required", 400);
    }

    if (cnp.length !== 13 || !cnp) {
      return sendError(res, "The CNP must be 13 digits long", 400);
    }

    const patient = await db.patients.findUnique({
      where: { cnp: cnp },
    });

    if (!patient) {
      return sendError(res, "The CNP is invalid", 400);
    }

    if (patient.name !== name) {
      return sendError(res, "The name does not match the CNP", 400);
    }

    return sendSucces(
      res,
      {
        patient: {
          id: patient.id,
          name: name,
          cnp: cnp, // nu vreau sa returnez si idDoctor motive de securitate asa ca creez eu un obiect personalizat cu datele pe care le vreau
        },
      },
      200
    );
  } catch (error) {
    console.log("ERROR on /patients/login POST", error);
    sendError(res, "Internal server error", 500);
  }
});

app.get("/patients/:idPatient", async (req, res) => {
  try {
    const { idPatient } = req.params;

    const patientData = await db.patients.findUnique({
      where: { id: idPatient },
      include: {
        doctor: {
          select: {
            name: true, //pentru a prelua si numele doctorului
          },
        },
        alergies: true,
      },
    });

    if (!patientData) {
      return sendError(res, "Patient was not found", 404);
    }

    return sendSucces(res, patientData, 200);
  } catch (err) {
    console.log("ERROR on /patients/:idPatient GET", err);
    sendError(res, "Internal server error", 500);
  }
});

app.delete("/doctors/:idDoctor/patients/:idPatient", async (req, res) => {
  try {
    const { idDoctor, idPatient } = req.params;

    const patient = await db.patients.findUnique({
      where: { id: idPatient },
    });

    if (!patient) {
      return sendError(res, "The patient does not exist", 404);
    }

    if (patient.doctorId !== idDoctor) {
      return sendError(
        res,
        "The patient does not belong to this doctor, therefore cannot be deleted",
        400
      );
    }

    const deletedPatient = await db.patients.delete({
      where: { id: idPatient },
    });
    return sendSucces(res, { deletedPatient }, 200);
  } catch (error) {
    console.log(
      "ERROR on /doctor/:idDoctor/patients/:idPatient DELETE: ",
      error
    );
    sendError(res, "Internal server error", 500);
  }
});

app.delete("/doctors/:idDoctor", async (req, res) => {
  try {
    const { idDoctor } = req.params;

    const doctor = await db.doctor.findUnique({
      where: { id: idDoctor },
    });

    if (!doctor) {
      return sendError(res, "The doctor was not found", 404);
    }

    if (doctor.profileImgUrl) {
      const imgPath = path.join(__dirname, "public", doctor.profileImgUrl); //construim path-ul unde se afla imaginea
      try {
        await fs.unlink(imgPath); // cu fs.unlink stergem un fisier din server si se foloseste await pentru (este si o functie asincrona) a face codul sa astepte stergerea daca se poate a fisierului
      } catch (fsError) {
        console.log("ERROR on /doctors/:idDoctor DELETE PHOTO", fsError);
        return sendError("Internal server error", fsError);
      }
    }

    const deletedDoctor = await db.doctor.delete({
      where: { id: idDoctor }, // onDelete: cascade se ocupa si de restul
    });

    return sendSucces(res, deletedDoctor, 200);
  } catch (error) {
    console.log("ERROR on /doctor/:idDoctor DELETE: ", error);
    sendError(res, "Internal server error", 500);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
