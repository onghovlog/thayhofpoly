const express = require('express');
const router = express.Router();
const {
  getInstructorProfile,
  updateInstructorProfile,
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getInstructorProfile)
  .put(protect, authorize('admin'), updateInstructorProfile);

module.exports = router;
