const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');


const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth.routes'));
app.use('/api/projects', require('../routes/project.routes'));
app.use('/api/tasks', require('../routes/task.routes'));
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

let mongoServer;
let authToken;
let userId;



beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    .expect(200);

  expect(res.body).toHaveProperty('token');
  authToken = res.body.token;

 
  const user = await User.findOne({ email: 'test@example.com' });
  userId = user._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
 
  await Task.deleteMany({});
  await Project.deleteMany({});
});

test('create project and perform full task lifecycle', async () => {
  
  const projRes = await request(app)
    .post('/api/projects')
    .set('x-auth-token', authToken)
    .send({ name: 'Website Redesign', description: 'Revamp landing page' })
    .expect(201);

  expect(projRes.body).toHaveProperty('_id');
  const projectId = projRes.body._id;

  
  const tasksToCreate = [
    { title: 'Design hero', status: 'todo', priority: 'high', project: projectId },
    { title: 'Implement header', status: 'in-progress', priority: 'medium', project: projectId },
    { title: 'Write copy', status: 'done', priority: 'low', project: projectId }
  ];

  for (const t of tasksToCreate) {
    const r = await request(app)
      .post('/api/tasks')
      .set('x-auth-token', authToken)
      .send(t)
      .expect(201);
    expect(r.body).toHaveProperty('_id');
    expect(r.body.title).toBe(t.title);
  }


  const listRes = await request(app)
    .get(`/api/tasks/project/${projectId}?page=1&limit=2`)
    .set('x-auth-token', authToken)
    .expect(200);

  expect(listRes.body).toHaveProperty('tasks');
  expect(Array.isArray(listRes.body.tasks)).toBe(true);
  expect(listRes.body.tasks.length).toBe(2);
  expect(listRes.body).toHaveProperty('totalPages');


  const todoRes = await request(app)
    .get(`/api/tasks/project/${projectId}?status=todo`)
    .set('x-auth-token', authToken)
    .expect(200);

  expect(todoRes.body.tasks.length).toBeGreaterThanOrEqual(1);
  expect(todoRes.body.tasks[0].status).toBe('todo');


  const taskToUpdate = todoRes.body.tasks[0];
  const upd = await request(app)
    .put(`/api/tasks/${taskToUpdate._id}`)
    .set('x-auth-token', authToken)
    .send({ status: 'in-progress' })
    .expect(200);

  expect(upd.body).toHaveProperty('status');
  expect(upd.body.status).toBe('in-progress');

 
  await request(app)
    .delete(`/api/tasks/${taskToUpdate._id}`)
    .set('x-auth-token', authToken)
    .expect(200);


  const afterDelete = await request(app)
    .get(`/api/tasks/project/${projectId}`)
    .set('x-auth-token', authToken)
    .expect(200);

  
  expect(afterDelete.body.tasks.length).toBe(2);
});
