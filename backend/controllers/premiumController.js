const User = require('../models/User');
const { 
  optimizeResume, 
  generateCareerRoadmap, 
  matchJobDescription, 
  compareCandidates 
} = require('../services/geminiService');

// Middleware helper to check if user is Premium
const verifyPremium = (user) => {
  return user && user.subscription === 'PREMIUM';
};

// @desc    AI Resume Optimizer
// @route   POST /api/premium/optimize-resume
// @access  Private (Candidate and Premium Only)
const optimizeUserResume = async (req, res) => {
  const { company, role } = req.body;

  if (!company || !role) {
    return res.status(400).json({ message: 'Company and target role are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!verifyPremium(user)) {
      return res.status(403).json({ 
        message: 'Upgrade to TalentAI Premium to unlock AI Resume Optimizer.', 
        gated: true 
      });
    }

    const optimizationResult = await optimizeResume(user, company, role);
    res.json(optimizationResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Career Roadmap
// @route   POST /api/premium/career-roadmap
// @access  Private (Candidate and Premium Only)
const generateUserRoadmap = async (req, res) => {
  const { currentSkills, targetCompany, targetRole } = req.body;

  if (!targetCompany || !targetRole) {
    return res.status(400).json({ message: 'Target company and target role are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!verifyPremium(user)) {
      return res.status(403).json({ 
        message: 'Upgrade to TalentAI Premium to unlock AI Career Roadmaps.', 
        gated: true 
      });
    }

    const skills = currentSkills || (user.skills ? user.skills.join(', ') : 'N/A');
    const roadmap = await generateCareerRoadmap(skills, targetCompany, targetRole);
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Job Description Matching
// @route   POST /api/premium/job-match
// @access  Private (Recruiter and Premium Only)
const matchJDToCandidates = async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ message: 'Job Description is required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!verifyPremium(user)) {
      return res.status(403).json({ 
        message: 'Upgrade to TalentAI Premium to unlock AI Job Description Matching.', 
        gated: true 
      });
    }

    // Fetch all student candidates
    const candidates = await User.find({ role: 'student' }).select('name skills title bio experience education');
    if (candidates.length === 0) {
      return res.json({ matches: [] });
    }

    const matchResults = await matchJobDescription(jobDescription, candidates);
    
    // Attach user profile information to the matches
    const populatedMatches = matchResults.matches.map(m => {
      const cand = candidates.find(c => c._id.toString() === m.candidateId);
      return {
        ...m,
        candidateName: cand ? cand.name : 'Unknown Candidate',
        candidateTitle: cand ? cand.title : 'Developer',
        candidateLocation: cand ? cand.location : 'Remote'
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort descending

    res.json({ matches: populatedMatches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Candidate Comparison
// @route   POST /api/premium/compare-candidates
// @access  Private (Recruiter and Premium Only)
const compareSelectedCandidates = async (req, res) => {
  const { candidateIds } = req.body;

  if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
    return res.status(400).json({ message: 'Provide an array of candidate IDs to compare.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!verifyPremium(user)) {
      return res.status(403).json({ 
        message: 'Upgrade to TalentAI Premium to unlock AI Candidate Comparison analytics.', 
        gated: true 
      });
    }

    // Fetch details of selected candidates
    const candidates = await User.find({ _id: { $in: candidateIds } }).select('name skills title bio experience education github');
    if (candidates.length === 0) {
      return res.status(400).json({ message: 'No valid candidates found for the provided IDs.' });
    }

    const comparison = await compareCandidates(candidates);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  optimizeUserResume,
  generateUserRoadmap,
  matchJDToCandidates,
  compareSelectedCandidates
};
