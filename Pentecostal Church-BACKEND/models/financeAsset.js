const mongoose = require("mongoose");

const valuationHistoryEntrySchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    method: { type: String, enum: ["initial", "appreciation", "depreciation", "market_appraisal"], required: true },
    reason: { type: String },
    valued_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valued_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const financeAssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    valuation: { type: Number, required: true },
    purchase_amount: { type: Number, required: true },
    purchase_date: { type: Date, required: true },
    condition: { type: String, enum: ["good", "fair", "poor", "new"], default: "good" },
    recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valuationHistory: { type: [valuationHistoryEntrySchema], default: [] },
  },
  { timestamps: true, collection: "finance_assets" }
);

module.exports = mongoose.model("FinanceAsset", financeAssetSchema);
