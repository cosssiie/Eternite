const jwt = require('jsonwebtoken');

module.exports = ({ req }) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) return { user: null };

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
    } catch {
        return { user: null };
    }
};