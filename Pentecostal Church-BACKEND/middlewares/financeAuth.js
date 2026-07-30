const jwt = require('jsonwebtoken');

/**
 * Finance authentication middleware.
 * Accepts System Admin (sadmin_token, account-provisioning only),
 * Patron (patron_token, read-only oversight), OR a Treasurer
 * (user_s with role=treasurer, or the finance SPA's Bearer token).
 *
 * Finance-authorized data-access role: treasurer only.
 * (auditor / chair_accounts / chairperson / blanket admin access were removed.)
 */

const FINANCE_ROLES = ['treasurer'];

module.exports = (req, res, next) => {
  // 1. Check the Authorization header (Bearer token) for the finance SPA FIRST.
  //    This is a deliberate, explicit credential sent by the finance app itself,
  //    so it must win over any incidental cookie (e.g. a treasurer who is also
  //    browsing the main site logged in as a regular member) — otherwise the
  //    cookie silently hijacks the request before the real token is ever checked.
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Try user secret first (treasurer accounts)
      const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
      const role = (decoded.role || '').toLowerCase();
      if (FINANCE_ROLES.includes(role)) {
        req.user = {
          id: decoded.userId,
          role: role,
        };
        return next();
      }
      return res.status(403).json({ message: 'Access denied: Your role does not have finance access.' });
    } catch (err) {
      try {
        // finance_token is signed with the admin secret; decode it but keep
        // the ACTUAL role from the payload — do not grant a blanket admin bypass.
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        req.user = {
          id: decoded.userId,
          role: decoded.role || 'admin',
        };
        return next();
      } catch (err2) {
        // Both secrets failed — fall through to cookie-based checks
      }
    }
  }

  // 2. Check for System Admin (sadmin_token) — identifies as role 'admin'.
  //    Route-level authorize() lists decide what 'admin' may actually touch;
  //    it is no longer an automatic bypass of finance data access.
  const adminToken = req.cookies.sadmin_token;
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET);
      req.user = {
        id: decoded.userId,
        role: decoded.role || 'admin',
      };
      return next();
    } catch (err) {
      // Invalid admin token — fall through to patron check
    }
  }

  // 3. Check for Patron (patron_token)
  const patronToken = req.cookies.patron_token;
  if (patronToken) {
    try {
      const decoded = jwt.verify(patronToken, process.env.JWT_ADMIN_SECRET);
      req.user = {
        id: decoded.userId,
        role: 'patron',
        isPatron: true,
      };
      return next();
    } catch (err) {
      // Invalid patron token — fall through to standard user check
    }
  }

  // 4. Check for standard user (user_s) with a finance-authorized role
  const userToken = req.cookies.user_s;
  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
      const role = (decoded.role || '').toLowerCase();
      if (FINANCE_ROLES.includes(role)) {
        req.user = {
          id: decoded.userId,
          role: role,
        };
        return next();
      }
      // User is authenticated but not authorized for finance
      return res.status(403).json({ message: 'Access denied: Your role does not have finance access.' });
    } catch (err) {
      // Invalid user token — fall through to 401
    }
  }

  // 5. No valid token found
  return res.status(401).json({ message: 'Authentication required: Please log in to access financial data.' });
};
