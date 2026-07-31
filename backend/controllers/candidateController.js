const User = require('../models/User');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Shortlist = require('../models/Shortlist');

// @desc    Get candidates list with search/filters
// @route   GET /api/candidates
// @access  Private (Recruiter only)
const getCandidates = async (req, res) => {
  const { search, skills, experience, score, location } = req.query;

  try {
    let query = { role: 'student' };

    // 1. Search text filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Skills filter
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      query.skills = { $all: skillList.map(skill => new RegExp(`^${skill}$`, 'i')) };
    }

    // 3. Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // 4. Experience level filter
    if (experience) {
      if (experience === 'Junior') {
        query.yearsOfExperience = { $gte: 0, $lte: 2 };
      } else if (experience === 'Mid') {
        query.yearsOfExperience = { $gte: 3, $lte: 5 };
      } else if (experience === 'Senior') {
        query.yearsOfExperience = { $gte: 6, $lte: 10 };
      } else if (experience === 'Lead') {
        query.yearsOfExperience = { $gt: 10 };
      }
    }

    // 5. AI Candidate Score filter (requires joining ResumeAnalysis)
    if (score) {
      const minScore = parseInt(score, 10);
      const highScoringAnalyses = await ResumeAnalysis.find({ candidateScore: { $gte: minScore } }).select('userId');
      const highScoringUserIds = highScoringAnalyses.map(a => a.userId);
      
      // Merge with query. If query already has userIds, do intersection
      query._id = { $in: highScoringUserIds };
    }

    // Fetch matching candidates
    const candidates = await User.find(query).select('-password');

    // Populate the analysis score for each candidate
    const candidateList = await Promise.all(candidates.map(async (candidate) => {
      const analysis = await ResumeAnalysis.findOne({ userId: candidate._id });
      // Check if shortlisted by this recruiter
      const isShortlisted = await Shortlist.exists({ recruiterId: req.user._id, candidateId: candidate._id });

      return {
        ...candidate.toObject(),
        aiScore: analysis ? analysis.candidateScore : null,
        recommendation: analysis ? analysis.recommendation : 'Applied',
        isShortlisted: !!isShortlisted
      };
    }));

    res.json(candidateList);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private (Recruiter or the student themselves)
const getCandidateById = async (req, res) => {
  try {
    const candidate = await User.findById(req.params.id).select('-password');
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const analysis = await ResumeAnalysis.findOne({ userId: candidate._id });
    const isShortlisted = await Shortlist.exists({ recruiterId: req.user._id, candidateId: candidate._id });

    res.json({
      ...candidate.toObject(),
      analysis: analysis || null,
      isShortlisted: !!isShortlisted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter analytics
// @route   GET /api/candidates/analytics
// @access  Private (Recruiter only)
const getRecruiterAnalytics = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: 'student' });
    
    // Calculate average AI score
    const analyses = await ResumeAnalysis.find({});
    const avgScore = analyses.length > 0 
      ? Math.round(analyses.reduce((acc, curr) => acc + curr.candidateScore, 0) / analyses.length) 
      : 0;

    const totalShortlisted = await Shortlist.countDocuments({ recruiterId: req.user._id });

    // Aggregate skill distribution (top skills)
    const candidates = await User.find({ role: 'student' }).select('skills');
    const skillCounts = {};
    candidates.forEach(c => {
      if (c.skills) {
        c.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    const topSkills = Object.keys(skillCounts)
      .map(skill => ({ skill, count: skillCounts[skill] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Aggregate top colleges/sources
    const collegeCounts = {};
    candidates.forEach(c => {
      if (c.college) {
        collegeCounts[c.college] = (collegeCounts[c.college] || 0) + 1;
      }
    });

    const topColleges = Object.keys(collegeCounts)
      .map(college => ({ college, count: collegeCounts[college] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Mock trend data for chart visualization
    const trends = [
      { month: 'Jan', applicants: 12, hired: 2 },
      { month: 'Feb', applicants: 19, hired: 3 },
      { month: 'Mar', applicants: 32, hired: 5 },
      { month: 'Apr', applicants: 28, hired: 4 },
      { month: 'May', applicants: 45, hired: 8 },
      { month: 'Jun', applicants: totalCandidates || 50, hired: totalShortlisted || 10 }
    ];

    res.json({
      stats: {
        totalCandidates,
        averageScore: avgScore || 85,
        totalShortlisted,
        activeJobsCount: 4
      },
      topSkills,
      topColleges,
      trends
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCandidates,
  getCandidateById,
  getRecruiterAnalytics
};
