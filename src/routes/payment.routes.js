import { Router } from 'express';
import { createOrder, reciveWebhook } from '../controller/payment.js'
import path  from  'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/payment', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

router.post('/process_payment/:id', createOrder)

router.get('/succes', (req, res)=>{
    res.send('succes')
})
router.get('/failure', (req, res)=>{
    res.send('failure')
})

router.post('/webhook', reciveWebhook)

export default router