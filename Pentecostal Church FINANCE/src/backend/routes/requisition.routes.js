const express = require("express");
const router = express.Router();
const { uploadVoucher } = require("../middleware/upload.middleware");
const requisitionController = require("../controllers/requisition.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const requisitionValidator = require("../validators/requisitionValidator");
const validateRequest = require("../middleware/validateRequest");

router.post("/", authenticate, authorize("treasurer"), requisitionValidator.create, validateRequest, requisitionController.create);
router.get(
  "/",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  requisitionController.getAll
);
router.get(
  "/:id",
  authenticate,
  authorize("admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron"),
  requisitionController.getById
);
router.put(
  "/:id/approve",
  authenticate,
  authorize("chairperson", "patron"),
  requisitionController.approve
);
router.put(
  "/:id/reject",
  authenticate,
  authorize("chairperson", "patron"),
  requisitionController.reject
);
router.put(
  "/:id/complete",
  authenticate,
  authorize("treasurer"),
  uploadVoucher.single("voucher"),
  requisitionController.complete
);

module.exports = router;
