
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Import routes
const patientRoutes = require('./routes/patients');
const sessionRoutes = require('./routes/sessions');

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'NURA API is running' });
});

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/sessions', sessionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
