const User = require('../models/User');

// @desc    Get all users (Admin only — for assigning tasks/projects)
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get members only
// @route   GET /api/users/members
const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password');
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getMembers };
