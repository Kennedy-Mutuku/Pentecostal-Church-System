const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get(
  "/statement",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  reportController.getFinancialStatement
);
router.get(
  "/categories",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  reportController.getCategoryBreakdown
);

module.exports = router;
