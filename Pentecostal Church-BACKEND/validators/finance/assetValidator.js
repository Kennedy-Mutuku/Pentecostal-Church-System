const { body } = require("express-validator");

exports.create = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("valuation").notEmpty().withMessage("Valuation is required").isNumeric().withMessage("Valuation must be numeric"),
  body("purchase_amount").notEmpty().withMessage("Purchase amount is required").isNumeric().withMessage("Purchase amount must be numeric"),
  body("purchase_date").notEmpty().withMessage("Purchase date is required").isISO8601().withMessage("Purchase date must be a valid date"),
  body("docket").trim().notEmpty().withMessage("Docket is required"),
  body("condition").optional().isIn(["good", "fair", "poor", "new"]).withMessage("Invalid condition"),
];

exports.revalue = [
  body("new_value").notEmpty().withMessage("New valuation is required").isFloat({ min: 0 }).withMessage("New valuation must be a non-negative number"),
  body("method").optional().isIn(["appreciation", "depreciation", "market_appraisal"]).withMessage("Invalid valuation method"),
  body("reason").optional().trim().isLength({ max: 500 }).withMessage("Reason must be under 500 characters"),
];
