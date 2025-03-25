
const express = require('express');
const router = express.Router();

// Mock data - would typically come from a database
let sessions = [
  {
    id: '1',
    patient_id: '1',
    start_time: '2023-06-01T10:00:00Z',
    end_time: '2023-06-01T11:00:00Z',
    duration: 60,
    environment: 'Clinic',
    completion_status: 'Completed',
    overall_score: 78,
    device: 'Tablet',
    attention: 82,
    memory: 75,
    executive_function: 68,
    behavioral: 80
  },
  {
    id: '2',
    patient_id: '1',
    start_time: '2023-06-08T10:00:00Z',
    end_time: '2023-06-08T11:00:00Z',
    duration: 60,
    environment: 'Home',
    completion_status: 'Completed',
    overall_score: 80,
    device: 'Tablet',
    attention: 85,
    memory: 78,
    executive_function: 72,
    behavioral: 83
  }
];

// Get all sessions
router.get('/', (req, res) => {
  const { patient_id } = req.query;
  
  if (patient_id) {
    const filteredSessions = sessions.filter(s => s.patient_id === patient_id);
    return res.json(filteredSessions);
  }
  
  res.json(sessions);
});

// Get session by ID
router.get('/:id', (req, res) => {
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(session);
});

// Create a new session
router.post('/', (req, res) => {
  const newSession = {
    id: (sessions.length + 1).toString(),
    ...req.body
  };
  sessions.push(newSession);
  res.status(201).json(newSession);
});

// Update a session
router.put('/:id', (req, res) => {
  const index = sessions.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  sessions[index] = { ...sessions[index], ...req.body };
  res.json(sessions[index]);
});

// Delete a session
router.delete('/:id', (req, res) => {
  const index = sessions.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  const deletedSession = sessions[index];
  sessions = sessions.filter(s => s.id !== req.params.id);
  res.json(deletedSession);
});

module.exports = router;
