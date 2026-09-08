const express = require('express');
const router = express.Router();
const {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
} = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPublicSettings)
  .put(protect, authorize('admin'), updateSettings);

router.route('/admin')
  .get(protect, authorize('admin'), getAdminSettings);

module.exports = router;
