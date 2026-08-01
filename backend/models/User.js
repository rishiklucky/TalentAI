const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  year: { type: String },
  description: { type: String }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  year: { type: String },
  description: { type: String }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter'], required: true },
  college: { type: String },
  skills: { type: [String], default: [] },
  github: { type: String },
  portfolio: { type: String },
  title: { type: String },
  location: { type: String },
  yearsOfExperience: { type: Number, default: 0 },
  bio: { type: String },
  avatar: { type: String },
  resumeFile: { type: String },
  resumeFileName: { type: String },
  education: { type: [educationSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  subscription: { type: String, enum: ['FREE', 'PREMIUM'], default: 'FREE' }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
