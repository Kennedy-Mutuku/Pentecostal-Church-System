const express = require("express");
const router = express.Router();
const controller = require("../../controllers/finance/reportController");
const authorize = require("../../middlewares/financeAuthorize");

router.get("/statement", authorize("treasurer", "patron"), controller.getFinancialStatement);
router.get("/categories", authorize("treasurer"), controller.getCategoryBreakdown);

module.exports = router;
