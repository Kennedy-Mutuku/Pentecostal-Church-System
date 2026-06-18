const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, default: null },
    action: {
      type: String,
      enum: ["create", "update", "delete", "approve", "reject", "reset_password", "login"],
      required: true,
    },
    entity: {
      type: String,
      enum: ["users", "transactions", "requisitions", "assets", "system"],
      required: true,
    },
    entity_id: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema, "finance_audit_logs");
