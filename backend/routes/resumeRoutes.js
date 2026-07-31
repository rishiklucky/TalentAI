const express = require('express');
const router = express.Router();
const { uploadAndAnalyzeResume, getResumeAnalysis } = require('../controllers/resumeController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student endpoints for uploading and viewing their own resume analysis
router.post('/upload', protect, requireRole('student'), upload.single('resume'), uploadAndAnalyzeResume);
router.get('/analysis', protect, requireRole('student'), getResumeAnalysis);

module.exports = router;
