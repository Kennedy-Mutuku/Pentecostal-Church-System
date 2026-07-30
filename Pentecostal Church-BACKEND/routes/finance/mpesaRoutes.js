const express = require("express");
const router = express.Router();
const controller = require("../../controllers/finance/mpesaController");
const authorize = require("../../middlewares/financeAuthorize");

router.post("/stkpush", authorize("treasurer"), controller.initiatePayment);

module.exports = router;
