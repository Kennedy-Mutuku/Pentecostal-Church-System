const express = require("express");
const router = express.Router();
const { uploadReceipt } = require("../middleware/upload.middleware");
const transactionController = require("../controllers/transaction.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const transactionValidator = require("../validators/transactionValidator");
const validateRequest = require("../middleware/validateRequest");

router.post(
  "/",
  authenticate,
  authorize("treasurer"),
  uploadReceipt.single("receipt"),
  transactionValidator.create,
  validateRequest,
  transactionController.create
);
router.get(
  "/",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  transactionController.getAll
);
router.get(
  "/my-contributions",
  authenticate,
  authorize("member", "admin", "treasurer"),
  transactionController.getMyContributions
);
router.get(
  "/balance",
  authenticate,
  authorize("admin", "treasurer", "chair_accounts", "chairperson"),
  transactionController.getBalance
);
router.get(
  "/:id",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson"),
  transactionController.getById
);

module.exports = router;
