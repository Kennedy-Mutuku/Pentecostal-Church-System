const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.admission_admin_token;
  
  if (!token) {
    console.log('No admission admin token provided');
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  const secretKey = process.env.JWT_ADMISSION_ADMIN_SECRET || process.env.JWT_ADMIN_SECRET || 'local_dev_admission_admin_secret_2025';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Authentication failed: ${err.message}` });
    }
    
    req.adminId = decoded.adminId;
    next();
  });
};