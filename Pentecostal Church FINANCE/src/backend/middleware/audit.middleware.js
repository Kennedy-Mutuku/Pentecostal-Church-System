const AuditLog = require("../models/auditLog.model");
const User = require("../models/user.model");

async function logAction(userId, action, entity, entityId, details = null, previousValue = null, newValue = null) {
  try {
    let role = null;
    if (userId) {
      const user = await User.findById(userId).select("role");
      role = user?.role || null;
    }
    await AuditLog.create({
      user_id: userId,
      role,
      action,
      entity,
      entity_id: entityId,
      details,
      previousValue,
      newValue,
    });
  } catch (err) {
    // Logging should never crash the main flow
    console.error("Audit log error:", err.message);
  }
}

module.exports = { logAction };
