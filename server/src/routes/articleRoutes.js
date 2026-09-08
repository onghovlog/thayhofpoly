const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getArticles)
  .post(protect, authorize('admin'), createArticle);

router.route('/:slug')
  .get(getArticleBySlug);

router.route('/id/:id')
  .get(protect, authorize('admin'), getArticleById)
  .put(protect, authorize('admin'), updateArticle)
  .delete(protect, authorize('admin'), deleteArticle);

module.exports = router;
