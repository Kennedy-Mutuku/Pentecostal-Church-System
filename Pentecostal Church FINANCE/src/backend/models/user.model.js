const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "treasurer", "auditor", "chair_accounts", "chairperson", "patron", "member"],
      default: "member",
    },
  },
  { timestamps: true, collection: "finance_users" }
);

module.exports = mongoose.model("User", userSchema);
