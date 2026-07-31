const express = require('express');
const router = express.Router();
const { getCandidates, getCandidateById, getRecruiterAnalytics } = require('../controllers/candidateController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Recruiter specific endpoints
router.get('/', protect, requireRole('recruiter'), getCandidates);
router.get('/analytics', protect, requireRole('recruiter'), getRecruiterAnalytics);
router.get('/:id', protect, requireRole('recruiter', 'student'), getCandidateById);

module.exports = router;
