const express = require('express');
const router = express.Router();
const {
  optimizeUserResume,
  generateUserRoadmap,
  matchJDToCandidates,
  compareSelectedCandidates
} = require('../controllers/premiumController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/optimize-resume', protect, requireRole('student'), optimizeUserResume);
router.post('/career-roadmap', protect, requireRole('student'), generateUserRoadmap);
router.post('/job-match', protect, requireRole('recruiter'), matchJDToCandidates);
router.post('/compare-candidates', protect, requireRole('recruiter'), compareSelectedCandidates);

module.exports = router;
