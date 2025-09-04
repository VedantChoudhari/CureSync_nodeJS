const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
// const auth = require('../middleware/auth'); // Uncomment if you want protected routes

router.post('/', /* auth, */ inventoryController.createItem);
router.get('/', inventoryController.getItems);
router.get('/:id', inventoryController.getItem);
router.put('/:id', /* auth, */ inventoryController.updateItem);
router.delete('/:id', /* auth, */ inventoryController.deleteItem);

module.exports = router;
