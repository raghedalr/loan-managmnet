const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-jwt-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        if (user.role !== 'branch_manager') {
            return res.status(403).json({ error: 'Access denied. Branch managers only.' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;