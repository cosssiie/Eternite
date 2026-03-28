const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Не авторизований' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepository.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User can\'t be found. Please try again.'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};