const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const authValidator = require("../validators/authValidator");
const validateRequest = require("../middleware/validateRequest");

router.post("/login", authValidator.login, validateRequest, authController.login);
router.post("/register", authenticate, authorize("admin"), authValidator.register, validateRequest, authController.register);
router.post("/reset-password", authenticate, authorize("admin"), authController.resetPassword);

module.exports = router;
