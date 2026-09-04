const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header
  let token = req.cookies.user_s;
  
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  const secretKey = process.env.JWT_USER_SECRET || 'local_dev_user_secret_key_2025';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Authentication failed: ${err.message}` });
    }
    
    req.user = { userId: decoded.userId };
    next();
  });
};