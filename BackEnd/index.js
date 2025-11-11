import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const db = new PrismaClient();
const port = 3000;

app.use(express.json());

app.post("/doctor", async(req,res) => {
    try{
        const { name, userName, password } = req.body;

        if(!name || !userName || !password){
            return res.status(400).json("Numele, username-ul si parola sunt obligatorii!!!");
        }
        if(password.length < 8){
            return res.status(400).json("Parola trebuie sa contina peste 8 caractere");
        }

        const doctor = await db.doctor.create({
            data: {
                name: name,
                userName: userName,
                password: password,
            },
        });
        res.status(201).json(doctor);
    }
    catch(error){
        console.log("ERROR on /doctor POST: ",error)
        res.status(500).json({error: "Internal server error"});
    }
});

app.get("/doctor/:idDoctor/patients", async(req, res) => {
    try{
        const { idDoctor } = req.params;
        const patients = await db.patients.findMany({
            where: {doctorId: idDoctor},
            include: {alergies: true},
        });
        if(!patients){
            return res.status(404).json("Pateints not found");
        }
        res.status(200).json(patients);
    }
    catch(error){
        console.log("ERROR on /doctor/patients GET: ",error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.get("/doctor/:idDoctor/:idPatient", async(req,res) => {
    try{
        const { idPatient } = req.params
        const patient = await db.patients.findUnique({
            where: {id: idPatient},
            include: {alergies: true},
        });
        if(!patient){
            return res.status(404).json("Patient not fond");
        }
        res.status(200).json(patient);
    }
    catch(error){
        console.log("ERROR on /doctor/:idPatient GET: ",error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/doctor/:idDoctor/patients", async(req,res) => {
    try{
        const { idDoctor } = req.params;
        const { name, cnp, alergies } = req.body;

        if(!name || !cnp || cnp.length !== 13){
            return res.status(400).json("Numele si CNP-ul sunt obligatorii!!!"); //Verificare input
        }

        const patient = await db.patients.create({
            data: {
                name: name,
                cnp: cnp,
                alergies: { 
                    create: alergies.map((alergie) => ({name: alergie.name}))
                },
                doctor: { connect: {id: idDoctor} }, // conectam datele de mai sus cu doctorul cu id-ul respectiv
            },
            include: { alergies: true }, // ca raspunsul pe care il primim sa aiba si alergiile in body
        });
        res.status(201).json(patient);
    }
    catch(error){
        console.log("ERROR on /doctor/:idDoctor/patients POST: ", error);
        res.status(500).json({error: "Internal server error"})
    }  
});

app.put("/doctor/:idDoctor/:idPatient", async(req,res) => {
    try{
        const { idPatient } = req.params;
        const { alergies } = req.body;
        

        if(!alergies){
            return res.status(400).json("Nu sunt introduse update-uri");
        }

        const patientUpdated = await db.patients.update({
            where: { id: idPatient },
            data: {
                alergies: { 
                    create: alergies.map((alergie) => ({name: alergie.name}))
                },
            },
            include: {alergies: true},
        });

        res.status(200).json(patientUpdated);
    }
    catch(error){
        console.log("ERROR on /doctor/:idDoctor/:idPatient PUT: ", error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});