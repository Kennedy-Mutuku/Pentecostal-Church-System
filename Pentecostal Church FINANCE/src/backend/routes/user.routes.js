const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/", authenticate, authorize("admin"), userController.getAll);
router.get("/:id", authenticate, authorize("admin"), userController.getById);
router.put("/:id", authenticate, authorize("admin"), userController.update);
router.delete("/:id", authenticate, authorize("admin"), userController.remove);

module.exports = router;
