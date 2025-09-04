const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../utils/upload'); // Import multer
const auth = require('../middleware/auth');

router.post('/', auth, upload.single('profileImage'), profileController.createProfile);
router.get('/', profileController.getProfiles);
router.get('/:id', profileController.getProfile);
router.put('/:id', auth, upload.single('profileImage'), profileController.updateProfile);
router.delete('/:id', auth, profileController.deleteProfile);

module.exports = router;
