const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.user_s;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  const secretKey = process.env.JWT_USER_SECRET || 'local_dev_user_secret_key_2025';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Authentication failed: ${err.message}` });
    }

    req.userId = decoded.userId;
    next();
  });
};

