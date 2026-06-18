const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    valuation: { type: Number, required: true },
    purchase_amount: { type: Number },          // optional — not collected by form
    purchase_date: { type: Date },              // optional — not collected by form
    docket: { type: String },                  // optional — not collected by form
    condition: {
      type: String,
      enum: ["good", "fair", "poor", "new"],
      default: "good",
      set: (v) => (typeof v === "string" ? v.toLowerCase() : v), // accept "Good", "GOOD" etc.
    },
    recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema, "finance_assets");
