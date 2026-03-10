const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// публічні
router.get('/tree', categoryController.getTree);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.get('/:id/template', categoryController.getTemplate);

// адмін
router.post('/', auth, admin, categoryController.create);
router.put('/:id', auth, admin, categoryController.update);
router.delete('/:id', auth, admin, categoryController.remove);
router.patch('/:id/toggle', auth, admin, categoryController.toggleActive);
router.post('/:id/template', auth, admin, categoryController.saveTemplate);

module.exports = router;