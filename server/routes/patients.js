
const express = require('express');
const router = express.Router();

// Mock data - would typically come from a database
let patients = [
  {
    id: '1',
    name: 'John Doe',
    age: 10,
    gender: 'Male',
    adhd_subtype: 'Combined',
    date: new Date().toISOString(),
    sessions_completed: 12,
    percentile: 65,
    progress: 12
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 8,
    gender: 'Female',
    adhd_subtype: 'Inattentive',
    date: new Date().toISOString(),
    sessions_completed: 8,
    percentile: 42,
    progress: 5
  }
];

// Get all patients
router.get('/', (req, res) => {
  res.json(patients);
});

// Get patient by ID
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

// Create a new patient
router.post('/', (req, res) => {
  const newPatient = {
    id: (patients.length + 1).toString(),
    ...req.body,
    date: new Date().toISOString()
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Update a patient
router.put('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  patients[index] = { ...patients[index], ...req.body };
  res.json(patients[index]);
});

// Delete a patient
router.delete('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  const deletedPatient = patients[index];
  patients = patients.filter(p => p.id !== req.params.id);
  res.json(deletedPatient);
});

module.exports = router;
