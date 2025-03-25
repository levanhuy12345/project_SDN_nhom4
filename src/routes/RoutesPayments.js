const express = require('express');
const router = express.Router();

const ControllerPayments = require('../controllers/ControllerPayments');

router.post('/api/payment', ControllerPayments.PaymentsMomo);
router.get('/api/checkdata', ControllerPayments.checkData);
router.get('/api/payment', ControllerPayments.getPayment);
router.post('/api/paymentcod', ControllerPayments.PaymentCod);
router.get('/api/payments', ControllerPayments.getPayments);
router.get('/api/dataorderuser', ControllerPayments.GetOrderUser);
router.post('/api/cancelorder', ControllerPayments.CancelOrder);

module.exports = router;
