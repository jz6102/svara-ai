const Task = require('../models/Task');

exports.createTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

exports.getTasksByProject = async (projectId, userId, filters, pagination) => {
  let query = { project: projectId, user: userId };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.deadlineStart && filters.deadlineEnd) {
    query.deadline = { $gte: new Date(filters.deadlineStart), $lte: new Date(filters.deadlineEnd) };
  }

  const { page, limit } = pagination;
  const tasks = await Task.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Task.countDocuments(query);
  return { tasks, totalPages: Math.ceil(count / limit), currentPage: page };
};

exports.updateTask = async (taskId, userId, updateData) => {
  return await Task.findOneAndUpdate({ _id: taskId, user: userId }, updateData, { new: true });
};

exports.deleteTask = async (taskId, userId) => {
  return await Task.findOneAndDelete({ _id: taskId, user: userId });
};