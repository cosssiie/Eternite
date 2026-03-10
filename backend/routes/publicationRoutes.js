const router = require('express').Router();
const publicationController = require('../controllers/publicationController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

// публичні тільки approved
router.get('/', publicationController.getAll);
router.get('/:id', publicationController.getOne);

// авторизований користувач
router.get('/my/publications', auth, publicationController.getMy);
router.post('/', auth, upload.single('image'), publicationController.create);
router.put('/:id', auth, upload.single('image'), publicationController.update);
router.delete('/:id', auth, publicationController.remove);

// адмін
router.patch('/:id/approve', auth, admin, publicationController.approve);
router.patch('/:id/reject', auth, admin, publicationController.reject);
router.patch('/:id/toggle', auth, admin, publicationController.toggleActive);

module.exports = router;