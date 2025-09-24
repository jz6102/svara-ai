const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/projects', require('./src/routes/project.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // For testing