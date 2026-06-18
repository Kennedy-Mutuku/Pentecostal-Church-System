const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const assetValidator = require("../validators/assetValidator");
const validateRequest = require("../middleware/validateRequest");

router.post("/", authenticate, authorize("treasurer"), assetValidator.create, validateRequest, assetController.create);
router.get(
  "/",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  assetController.getAll
);
router.get(
  "/:id",
  authenticate,
  authorize("admin", "treasurer", "chair_accounts"),
  assetController.getById
);
router.put("/:id", authenticate, authorize("treasurer", "admin"), assetController.update);
router.delete("/:id", authenticate, authorize("admin", "treasurer"), assetController.remove);

module.exports = router;
