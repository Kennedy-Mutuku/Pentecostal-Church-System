const mongoose = require("mongoose");

// Tracks an STK push from initiation to callback so the category/user can be
// linked even if the server restarts in between (in-memory tracking can't
// survive a redeploy or a free-tier dyno spinning down mid-transaction).
// TTL index auto-removes stale records after 1 hour.
const financePendingPaymentSchema = new mongoose.Schema(
  {
    checkout_request_id: { type: String, required: true, unique: true },
    merchant_request_id: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    category: { type: String, default: "offering" },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
  },
  { collection: "finance_pending_payments" }
);

module.exports = mongoose.model("FinancePendingPayment", financePendingPaymentSchema);
