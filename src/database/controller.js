import { createAccount, verifyAccount, alterTable } from "./database.js";
import jwt from 'jsonwebtoken';
import { JWT } from "../config.js";

export const process_webhook = async (result) => {
    //console.log(result)
    const { description, additional_info, external_reference, payer } = result
    const ip = additional_info.ip_address;
    const email = payer.email
    const dni = payer.identification.number
    //console.log(description, '\n', ip, '\n', email, '\n', external_reference)
    console.log(await alterTable(ip, email, external_reference, dni, description)) // procesar si se vuelve a pagar (que se extienda la exp)
    //guardar en base de datos y mandar por rcon
}

// cuentas 
export const createAccountPost = async (req, res) => {
    console.log(req.body)
    const regex = /[^a-zA-Z0-9]/;
    const { user, password, nickname } = req.body;
    if ((!regex.test(password) && !regex.test(user)) && (user.length >= 4 && password.length >= 4) && nickname.length >= 2) {
        const result = createAccount(user, password, nickname);
        res.send(await result)
    } else {
        res.send({ status: 'string error' })
    }
};

export const verifyAccountPost = async (req, res) => {
    console.log(req.body)
    const regex = /[^a-zA-Z0-9]/;
    const { user, password } = req.body;
    if ((!regex.test(password) && !regex.test(user)) && (user.length >= 4 && password.length >= 4)) {
        const result = await verifyAccount(user, password);
        console.log(result)
        if (!result.data) res.send({ status: 'error2'})
        const token = jwt.sign({ id: result.data.id, usuario: result.data.usuario, nickname: result.data.nickname }, JWT, { expiresIn: '400d' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 30 * 24 * 60 * 60 * 100000 });
        res.send(await result)
    } else {
        res.send({ status: 'string error' })
    }
}

export const apiProtected = (req, res) => {
    res.send(req.user);
};