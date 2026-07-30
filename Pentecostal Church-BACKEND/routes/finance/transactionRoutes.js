const express = require("express");
const router = express.Router();
const { uploadReceipt } = require("../../middlewares/financeUpload");
const controller = require("../../controllers/finance/transactionController");
const authorize = require("../../middlewares/financeAuthorize");
const transactionValidator = require("../../validators/finance/transactionValidator");
const validateRequest = require("../../middlewares/validateRequest");

router.post("/", authorize("treasurer"), uploadReceipt.single("receipt"), transactionValidator.create, validateRequest, controller.create);
router.get("/", authorize("treasurer", "patron"), controller.getAll);
router.get("/balance", authorize("treasurer", "patron"), controller.getBalance);
router.get("/:id", authorize("treasurer"), controller.getById);

module.exports = router;
