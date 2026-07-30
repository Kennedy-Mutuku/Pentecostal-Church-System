const express = require("express");
const router = express.Router();
const controller = require("../../controllers/finance/assetController");
const authorize = require("../../middlewares/financeAuthorize");
const assetValidator = require("../../validators/finance/assetValidator");
const validateRequest = require("../../middlewares/validateRequest");

router.post("/", authorize("treasurer"), assetValidator.create, validateRequest, controller.create);
router.get("/", authorize("treasurer", "patron"), controller.getAll);
router.get("/:id", authorize("treasurer", "patron"), controller.getById);
router.put("/:id", authorize("treasurer"), controller.update);
router.put("/:id/revalue", authorize("treasurer"), assetValidator.revalue, validateRequest, controller.revalue);
router.delete("/:id", authorize("treasurer"), controller.remove);

module.exports = router;
