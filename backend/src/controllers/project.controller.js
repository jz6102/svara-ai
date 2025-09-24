const projectService = require('../services/project.service');

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject({ ...req.body, user: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await projectService.deleteProject(req.params.id, req.user.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};