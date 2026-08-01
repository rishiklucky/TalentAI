const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, college, github, portfolio } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      college,
      github,
      portfolio
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.college = req.body.college !== undefined ? req.body.college : user.college;
      user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
      user.github = req.body.github !== undefined ? req.body.github : user.github;
      user.portfolio = req.body.portfolio !== undefined ? req.body.portfolio : user.portfolio;
      user.title = req.body.title !== undefined ? req.body.title : user.title;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.yearsOfExperience = req.body.yearsOfExperience !== undefined ? req.body.yearsOfExperience : user.yearsOfExperience;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
      user.education = req.body.education !== undefined ? req.body.education : user.education;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscription: updatedUser.subscription,
        college: updatedUser.college,
        skills: updatedUser.skills,
        github: updatedUser.github,
        portfolio: updatedUser.portfolio,
        title: updatedUser.title,
        location: updatedUser.location,
        yearsOfExperience: updatedUser.yearsOfExperience,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        education: updatedUser.education,
        experience: updatedUser.experience,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upgrade user subscription to PREMIUM (optionally using a coupon code)
// @route   POST /api/auth/upgrade
// @access  Private
const upgradeSubscription = async (req, res) => {
  const { couponCode } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If couponCode is provided, validate it
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid coupon code' });
      }
      if (!coupon.isActive) {
        return res.status(400).json({ message: 'This coupon is deactivated/expired' });
      }
    }

    // Upgrade user
    user.subscription = 'PREMIUM';
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      subscription: updatedUser.subscription,
      college: updatedUser.college,
      skills: updatedUser.skills,
      github: updatedUser.github,
      portfolio: updatedUser.portfolio,
      title: updatedUser.title,
      location: updatedUser.location,
      yearsOfExperience: updatedUser.yearsOfExperience,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      education: updatedUser.education,
      experience: updatedUser.experience,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  upgradeSubscription
};
