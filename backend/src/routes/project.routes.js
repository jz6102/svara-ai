const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { createProject, getProjects, deleteProject } = require('../controllers/project.controller');

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.delete('/:id', auth, deleteProject);

module.exports = router;