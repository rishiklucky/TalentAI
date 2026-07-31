const Shortlist = require('../models/Shortlist');
const User = require('../models/User');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// @desc    Shortlist candidate
// @route   POST /api/shortlist
// @access  Private (Recruiter only)
const shortlistCandidate = async (req, res) => {
  const { candidateId } = req.body;

  try {
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== 'student') {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Toggle logic: check if already shortlisted
    const existing = await Shortlist.findOne({
      recruiterId: req.user._id,
      candidateId
    });

    if (existing) {
      // Remove it (unshortlist)
      await Shortlist.findByIdAndDelete(existing._id);
      return res.json({ message: 'Candidate removed from shortlist', isShortlisted: false });
    }

    // Create new shortlist record
    await Shortlist.create({
      recruiterId: req.user._id,
      candidateId
    });

    res.status(201).json({ message: 'Candidate added to shortlist', isShortlisted: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shortlisted candidates for the current recruiter
// @route   GET /api/shortlist
// @access  Private (Recruiter only)
const getShortlistedCandidates = async (req, res) => {
  try {
    const list = await Shortlist.find({ recruiterId: req.user._id }).populate('candidateId');
    
    // Format response and attach analysis score
    const candidates = await Promise.all(list.map(async (item) => {
      const candidate = item.candidateId;
      if (!candidate) return null;

      const analysis = await ResumeAnalysis.findOne({ userId: candidate._id });

      return {
        ...candidate.toObject(),
        aiScore: analysis ? analysis.candidateScore : null,
        recommendation: analysis ? analysis.recommendation : 'Applied',
        isShortlisted: true
      };
    }));

    // Filter out null candidates in case a user was deleted
    res.json(candidates.filter(c => c !== null));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  shortlistCandidate,
  getShortlistedCandidates
};
