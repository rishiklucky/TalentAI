const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  matchPercentage: { type: Number, required: true }
});

const interviewQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String },
  hints: { type: String }
});

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  summary: { type: String },
  candidateScore: { type: Number, default: 0 },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  skillGap: { type: [skillGapSchema], default: [] },
  interviewQuestions: { type: [interviewQuestionSchema], default: [] },
  recommendation: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
