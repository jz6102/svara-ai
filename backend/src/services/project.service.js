const Project = require('../models/Project');

exports.createProject = async (projectData) => {
  const project = new Project(projectData);
  return await project.save();
};

exports.getProjects = async (userId) => {
  return await Project.find({ user: userId }).sort({ createdAt: -1 });
};

exports.deleteProject = async (projectId, userId) => {
  return await Project.findOneAndDelete({ _id: projectId, user: userId });
};