const jwt = require('jsonwebtoken');
const { verify } = jwt;

module.exports = (req, res, next) => {
  const token = req.cookies.patron_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  const secretKey = process.env.JWT_ADMIN_SECRET || 'local_dev_admin_secret_2025';

  verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Authentication failed: ${err.message}` });
    }

    req.userId = decoded.userId;
    next();
  });
};
