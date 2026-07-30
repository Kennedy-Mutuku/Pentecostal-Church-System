const express = require("express");
const router = express.Router();
const controller = require("../../controllers/finance/userController");
const authorize = require("../../middlewares/financeAuthorize");

router.get("/", authorize("treasurer"), controller.getAll);
router.post("/", authorize("treasurer"), controller.create);
router.put("/:id/reset-password", authorize("treasurer"), controller.resetPassword);
router.delete("/:id", authorize("treasurer"), controller.deleteUser);

module.exports = router;
