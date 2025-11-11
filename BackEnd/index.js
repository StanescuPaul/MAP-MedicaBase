import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const db = new PrismaClient();
const port = 3000;

app.use(express.json());

app.get("/admin/patients", async(req, res) => {
    try{
        const patients = await db.patient.findMany();
        res.status(200).json(patients);
    }
    catch(error){
        console.log("ERROR on /admin/patients GET: ",error);
        res.status(500).json("Internal server error");
    }
})

app.get("/admin/:idPatient", async(req,res) => {
    try{
        const { idPatient } = req.params
        const patient = await db.patient.findUnique({
            where: {id: idPatient},
        });
        if(!patient){
            return res.status(404).json("Patient not fond");
        }
        res.status(200).json(patient);
    }
    catch(error){
        console.log("ERROR on /admin/:idPatient GET: ",error);
        res.status(500).json("Internal server error");
    }
})

app.listen = (port, () => {
    console.log(`Server is listening on port ${port}...`);
});