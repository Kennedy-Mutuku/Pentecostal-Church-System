const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/", authenticate, authorize("admin", "auditor", "treasurer", "patron", "chairperson"), auditController.getAll);

module.exports = router;

