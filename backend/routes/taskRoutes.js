const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);

router
  .route('/')
  .get(getTasks)
  .post(
    adminOnly,
    [
      body('title').notEmpty().withMessage('Task title is required'),
      body('project').notEmpty().withMessage('Project ID is required'),
    ],
    createTask
  );

router
  .route('/:id')
  .put(updateTask)
  .delete(adminOnly, deleteTask);

module.exports = router;
