/**
 * Finance role-based authorization middleware.
 * Checks req.user.role strictly against the roles allowed for this route.
 * No automatic bypass — including for System Admin — so each route
 * explicitly declares who may touch it.
 */
module.exports = function financeAuthorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
