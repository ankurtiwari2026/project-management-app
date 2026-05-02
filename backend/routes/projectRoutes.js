const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // All project routes require auth

router
  .route('/')
  .get(getProjects)
  .post(
    adminOnly,
    [body('name').notEmpty().withMessage('Project name is required')],
    createProject
  );

router
  .route('/:id')
  .get(getProjectById)
  .put(adminOnly, updateProject)
  .delete(adminOnly, deleteProject);

module.exports = router;
