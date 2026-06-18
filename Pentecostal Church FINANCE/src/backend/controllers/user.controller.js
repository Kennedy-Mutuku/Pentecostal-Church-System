const User = require("../models/user.model");
const { logAction } = require("../middleware/audit.middleware");

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use." });
      }
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    ).select("-password");
    await logAction(req.user.id, "update", "users", req.params.id, { name, email, phone, role });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await logAction(req.user.id, "delete", "users", req.params.id, {});
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
