const jwt = require('jsonwebtoken');

const overseerAuth = (req, res, next) => {
  const token = req.cookies.overseer_token;

  if (!token) {
    // DEV MODE BYPASS: If no token is provided but we are in local development, allow access!
    // This ensures local testing writes to the local database instead of localStorage
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';
    const isLocalRequest = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    
    if (isDevelopment && isLocalRequest) {
      console.log('⚠️ [DEV MODE] Bypassing Overseer Auth for local database write');
      req.overseerAuth = true;
      req.user = { role: 'overseer' }; // Mock the overseer user
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Overseer authentication required: No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_OVERSEER_SECRET);

    if (decoded.role !== 'overseer') {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed: Invalid role.'
      });
    }

    req.overseerAuth = true;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: `Authentication failed: ${err.message}`
    });
  }
};

module.exports = { overseerAuth };
