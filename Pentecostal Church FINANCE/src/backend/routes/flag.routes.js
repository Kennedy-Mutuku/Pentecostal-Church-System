const express = require("express");
const router = express.Router();
const flagController = require("../controllers/flag.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// Only auditor and admin can create or view flags
router.post("/", authenticate, authorize("auditor", "admin"), flagController.createFlag);
router.get("/", authenticate, authorize("auditor", "admin"), flagController.getAllFlags);
router.get("/:entityId", authenticate, authorize("auditor", "admin"), flagController.getFlagsByEntity);

module.exports = router;
