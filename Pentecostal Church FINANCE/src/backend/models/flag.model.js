const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema(
  {
    flagged_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entity: {
      type: String,
      enum: ["transactions", "assets", "requisitions"],
      required: true,
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flag", flagSchema);
