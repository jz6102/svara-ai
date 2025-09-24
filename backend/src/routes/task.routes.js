const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/task.controller');

router.post('/', auth, createTask);
router.get('/project/:projectId', auth, getTasksByProject);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;