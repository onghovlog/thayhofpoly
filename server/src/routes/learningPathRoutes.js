const express = require('express');
const router = express.Router();
const {
  getLearningPaths,
  getLearningPathBySlug,
  getLearningPathById,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} = require('../controllers/learningPathController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getLearningPaths)
  .post(protect, authorize('admin'), createLearningPath);

router.route('/:slug')
  .get(getLearningPathBySlug);

router.route('/id/:id')
  .get(protect, authorize('admin'), getLearningPathById)
  .put(protect, authorize('admin'), updateLearningPath)
  .delete(protect, authorize('admin'), deleteLearningPath);

module.exports = router;
