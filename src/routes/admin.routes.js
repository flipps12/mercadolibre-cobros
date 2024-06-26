import { Router } from 'express';
import { authMiddleware } from './sesion.routes.js';
import { viewWhiteList } from '../rcon/connection.js';
import { viewPlansDB } from '../database/database.js';
import { process_webhook } from '../database/controller.js';
import path from 'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));


// TODO: Crear rutas para admins como: mirar la base de datos, modificar y cosas asi
//! en la apiProtected agregar para que puedan estar mas de un admin :)

router.get('/admin', authMiddleware, async (req, res) => {
    console.log(req.user.isAdmin ? 'hola' : 'no hola')
    console.log(req.user.isAdmin)
    if (!req.user.isAdmin) {
        res.send('No sos un admin, raja de aca');
        return
    };
    res.sendFile(path.join(__dirname, 'public', 'admin', 'admin.html'));
});

router.post('/admin/adduser', authMiddleware, async (req, res) => {
    console.log(req.body)
    if (!req.user.isAdmin) {
        res.send('No sos un admin, raja de aca');
        return
    };
    res.send(await process_webhook({
        external_reference: `${req.body.user},Basic server`,
        additional_info: {
            ip_address: null
        },
        payer: {
            email: null,
            identification: { number: 1234 }
        },
        description: 'Basic Server',
    }))
});


router.get('/admin/db', authMiddleware, async (req, res) => {
    console.log(req.body)
    if (!req.user.isAdmin) {
        res.send('No sos un admin, raja de aca');
        return
    };

    res.send(await viewPlansDB());
});

router.get('/admin/whitelist', async (req, res) => {
    const whitelist = await viewWhiteList()
    res.send(whitelist.split(': '))
});

// ! post() ejecutar comandos en el servidor como administrador (Seguridad alta)
// ! get() Mirar lista de jugfadores conectados, en whitelist, pagos, etc

export default router