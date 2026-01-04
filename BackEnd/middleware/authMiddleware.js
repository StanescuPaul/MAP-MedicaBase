import jwt from "jsonwebtoken";
import { sendSucces, sendError } from "../helper/response.js";

export const authentificateToken = async (req, res, next) => {
  //extrag header-ul pe care il folosesc lowercase pentru ca asa il transforma express
  const authHeader = req.headers["authorization"]; //folosim ["authorization"] pentru proprietatea din obiectul headers pentru a generaliza (in acest caz nu e nevoie) dar in cazul porprietatiilor cu caractere speciale nu poti sa accesezi cu . proprietatea doar asa cu []
  //extrag token-ul din header split(" ")[1] ca sa iau al doilea element primul fiind Bearer
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendError(res, "Unauthorized. No token provided.", 401); //401 codul pentru unauthorized
  }
  try {
    //decodificam token-ul sa vedem daca e valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //daca nu e corect token-ul jwt.verify arunca eroare si intra in catch
    //creez inca o proprietate pentru obiectul req care este deja predefinit si pot sa accesez acea proprietate in orice ruta in care folosesc si middleware-ul respectiv
    //in loc sa mai folosesc req.params.id ceea ce e nesigur deoarece oricine poate scrie in params acum o sa folosesc req.user
    req.user = decoded; //datele care sunt bagate in user sunt din payload
    //next este semnalul care spune codului sa treaca de la middleware la urmatoarea instructiune
    next();
  } catch (error) {
    console.log("ERROR verifying the token: ", error);
    return sendError(res, "Unauthorized. Invalid token.", 401);
  }
};

//deci acest middleware de auth cu jwt este practic un mod de generare a unui token in momentul login-ului unui doctor
//care este doar pentru sesiunea respectiva a utilizatorului si acest token este trimis la fiecare ruta care contine middleware-ul
//respectiv in cazul in care token.verify este corect iti da voie sa ajungi la ruta de baza daca nu iti da eroare si nu intrii in
//acea ruta iar pe langa asta te ajuta si sa folosesti datele din payload pentru a nu mai lua datele din params pentru ca in params
//poti introduce date o data ce esti logat si poti vedea date sensibile ale altui utilizator
