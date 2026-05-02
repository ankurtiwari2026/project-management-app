const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create task (Admin only)
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, project, assignedTo, status, deadline } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({ title, description, project, assignedTo, status, deadline });
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let filter = {};

    if (projectId) filter.project = projectId;

    // Members only see tasks assigned to them
    if (req.user.role === 'member') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Members can only update status of their own tasks
    if (req.user.role === 'member') {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      // Member can only change status
      const { status } = req.body;
      task.status = status || task.status;
      await task.save();
    } else {
      // Admin can update all fields
      Object.assign(task, req.body);
      await task.save();
    }

    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task (Admin only)
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
const getDashboardStats = async (req, res) => {
  try {
    let taskFilter = {};
    if (req.user.role === 'member') {
      taskFilter.assignedTo = req.user._id;
    }

    const now = new Date();

    const [total, completed, pending, inProgress, overdue] = await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({ ...taskFilter, status: 'Pending' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({
        ...taskFilter,
        status: { $ne: 'Completed' },
        deadline: { $lt: now },
      }),
    ]);

    res.json({
      success: true,
      data: { total, completed, pending, inProgress, overdue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, getDashboardStats };
