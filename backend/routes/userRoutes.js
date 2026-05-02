const express = require('express');
const router = express.Router();
const { getAllUsers, getMembers } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/members', protect, adminOnly, getMembers);

module.exports = router;
