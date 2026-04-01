const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// публічні
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify/:token', userController.verifyEmail);

// авторизований користувач
router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.post('/favourites/:publicationId', auth, userController.toggleFavourite);
router.get('/favourites', auth, userController.getFavourites);
router.delete('/me', auth, userController.deleteMe);

// адмін
router.get('/', auth, admin, userController.getAll);
router.put('/:id', auth, admin, userController.updateUser);
router.delete('/:id', auth, admin, userController.deleteUser);
router.patch('/:id/toggle', auth, admin, userController.toggleActive);

module.exports = router;