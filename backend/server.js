require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const shortlistRoutes = require('./routes/shortlistRoutes');

// Initialize database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/shortlist', shortlistRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Base route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the TalentAI API' });
  });

  // 404 Not Found Handler
  app.use((req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
