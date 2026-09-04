const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.user_s;

    if (token) {
        try {
            const secretKey = process.env.JWT_USER_SECRET || 'local_dev_user_secret_key_2025';
            const decoded = jwt.verify(token, secretKey);
            req.userId = decoded.userId;
        } catch (err) {
            console.warn('Optional auth failed:', err.message);
        }
    }
    next();
};
