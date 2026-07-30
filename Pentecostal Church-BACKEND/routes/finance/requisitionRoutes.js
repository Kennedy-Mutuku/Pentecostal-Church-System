const express = require("express");
const router = express.Router();
const { uploadVoucher } = require("../../middlewares/financeUpload");
const controller = require("../../controllers/finance/requisitionController");
const authorize = require("../../middlewares/financeAuthorize");
const requisitionValidator = require("../../validators/finance/requisitionValidator");
const validateRequest = require("../../middlewares/validateRequest");

router.post("/", authorize("treasurer"), requisitionValidator.create, validateRequest, controller.create);
router.get("/", authorize("treasurer", "patron"), controller.getAll);
router.get("/:id", authorize("treasurer", "patron"), controller.getById);
router.put("/:id/approve", authorize("patron"), controller.approve);
router.put("/:id/reject", authorize("patron"), controller.reject);
router.put("/:id/complete", authorize("treasurer"), uploadVoucher.single("voucher"), controller.complete);

module.exports = router;
