const router = require('express').Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
