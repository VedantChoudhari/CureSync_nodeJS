const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/', userController.createUser);
router.get('/', auth, userController.getUsers); // Protected route
router.get('/:id', auth, userController.getUser); // Protected route
router.put('/:id', auth, userController.updateUser); // Protected route
router.delete('/:id', auth, userController.deleteUser); // Protected route

module.exports = router;