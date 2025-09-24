const taskService = require('../services/task.service');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      deadlineStart: req.query.deadlineStart,
      deadlineEnd: req.query.deadlineEnd
    };
    const pagination = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10
    };
    const result = await taskService.getTasksByProject(req.params.projectId, req.user.id, filters, pagination);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};