const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  deleteContact,
  updateContactStatus,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteContact);

router.route('/:id/status')
  .patch(protect, authorize('admin'), updateContactStatus);

module.exports = router;
