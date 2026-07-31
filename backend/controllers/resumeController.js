const pdfParse = require('pdf-parse');
const { analyzeResume } = require('../services/geminiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/upload
// @access  Private (Student only)
const uploadAndAnalyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume file' });
  }

  try {
    // 1. Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the PDF file. Ensure the PDF is not an image scan.' });
    }

    // 2. Send text to Gemini API for parsing & analysis
    const aiAnalysis = await analyzeResume(resumeText);

    // 3. Update or Create ResumeAnalysis in Database
    let analysis = await ResumeAnalysis.findOne({ userId: req.user._id });

    const analysisData = {
      userId: req.user._id,
      summary: aiAnalysis.summary,
      candidateScore: aiAnalysis.candidateScore,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      skillGap: aiAnalysis.skillGap,
      interviewQuestions: aiAnalysis.interviewQuestions,
      recommendation: aiAnalysis.recommendation
    };

    if (analysis) {
      analysis = await ResumeAnalysis.findOneAndUpdate(
        { userId: req.user._id },
        analysisData,
        { new: true }
      );
    } else {
      analysis = await ResumeAnalysis.create(analysisData);
    }

    // 4. Update the candidate's User profile info
    const user = await User.findById(req.user._id);
    if (user) {
      user.skills = aiAnalysis.skills || user.skills;
      user.yearsOfExperience = aiAnalysis.yearsOfExperience !== undefined ? aiAnalysis.yearsOfExperience : user.yearsOfExperience;
      user.college = aiAnalysis.college || user.college;
      user.title = aiAnalysis.title || user.title;
      user.location = aiAnalysis.location || user.location;
      user.bio = aiAnalysis.bio || user.bio;
      user.resumeFile = req.file.buffer.toString('base64');
      user.resumeFileName = req.file.originalname;
      
      if (aiAnalysis.education && aiAnalysis.education.length > 0) {
        user.education = aiAnalysis.education;
      }
      if (aiAnalysis.experience && aiAnalysis.experience.length > 0) {
        user.experience = aiAnalysis.experience;
      }

      await user.save();
    }

    res.status(200).json({
      message: 'Resume parsed and analyzed successfully',
      analysis,
      profile: {
        skills: user.skills,
        yearsOfExperience: user.yearsOfExperience,
        college: user.college,
        title: user.title,
        location: user.location,
        bio: user.bio,
        education: user.education,
        experience: user.experience,
        resumeFileName: user.resumeFileName
      }
    });

  } catch (error) {
    console.error('Error parsing and analyzing resume:', error);
    res.status(500).json({ message: 'Error processing resume file', error: error.message });
  }
};

// @desc    Get Resume Analysis
// @route   GET /api/resume/analysis
// @access  Private (Student)
const getResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ userId: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'No resume analysis found. Please upload your resume first.' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download/View User's Own Resume
// @route   GET /api/resume/view
// @access  Private (Student)
const viewOwnResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.resumeFile) {
      return res.status(404).json({ message: 'No resume file uploaded yet.' });
    }
    const pdfBuffer = Buffer.from(user.resumeFile, 'base64');
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${user.resumeFileName || 'resume.pdf'}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download/View Candidate Resume for Recruiters/Users
// @route   GET /api/resume/view/:userId
// @access  Private (Authenticated)
const viewCandidateResume = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resumeFile) {
      return res.status(404).json({ message: 'No resume file found for this candidate.' });
    }
    const pdfBuffer = Buffer.from(user.resumeFile, 'base64');
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${user.resumeFileName || 'resume.pdf'}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getResumeAnalysis,
  viewOwnResume,
  viewCandidateResume
};
