const express = require('express');
const router = express.Router();
const { shortlistCandidate, getShortlistedCandidates } = require('../controllers/shortlistController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.use(protect);
router.use(requireRole('recruiter'));

router.route('/')
  .post(shortlistCandidate)
  .get(getShortlistedCandidates);

module.exports = router;
