const mongoose = require("mongoose");

const requisitionSchema = new mongoose.Schema(
  {
    requested_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    amount_requested: { type: Number, required: true },
    amount_spent: { type: Number, default: null },
    voucher_url: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Requisition", requisitionSchema, "finance_requisitions");
