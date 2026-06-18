const Flag = require("../models/flag.model");

// POST /api/flags — Auditor creates a flag on a record
exports.createFlag = async (req, res) => {
  try {
    const { entity, entity_id, comment } = req.body;

    if (!entity || !entity_id || !comment) {
      return res.status(400).json({ message: "entity, entity_id, and comment are required." });
    }

    const flag = await Flag.create({
      flagged_by: req.user.id,
      entity,
      entity_id,
      comment,
    });

    res.status(201).json({ message: "Record flagged for review.", id: flag._id });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// GET /api/flags — Admin & Auditor view all flags
exports.getAllFlags = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate("flagged_by", "name role")
      .sort({ createdAt: -1 });
    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// GET /api/flags/:entityId — Get flags for a specific record
exports.getFlagsByEntity = async (req, res) => {
  try {
    const flags = await Flag.find({ entity_id: req.params.entityId })
      .populate("flagged_by", "name role")
      .sort({ createdAt: -1 });
    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
