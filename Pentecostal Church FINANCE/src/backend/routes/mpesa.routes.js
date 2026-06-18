const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesa.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/stkpush', authenticate, authorize('treasurer', 'admin'), mpesaController.initiatePayment);
router.post('/callback', mpesaController.callback); // No auth - Safaricom calls this

module.exports = router;
