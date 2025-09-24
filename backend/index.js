const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const allowedOrigins = [
  'http://localhost:3000', 
  process.env.CLIENT_URL    
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
connectDB();

// app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/projects', require('./src/routes/project.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; 