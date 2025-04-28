
import axios from "axios";
import { API_BASE } from "./config";

const getPatientsByClinician = (clinicianId: string) => {
  return axios.get(`${API_BASE}/${clinicianId}/patients`);
};

const getPatientById = (clinicianId: string, patientId: string) => {
  return axios.get(`${API_BASE}/${clinicianId}/patients/${patientId}`);
};

const getPatientProfile = (userId: string) => {
  return axios.get(`${API_BASE}/api/cognitive/profile/${userId}`);
};

const getPatientTrendData = (userId: string) => {
  return axios.get(`${API_BASE}/api/cognitive/trends/${userId}`);
};

const getPatientSessions = (userId: string) => {
  return axios.get(`${API_BASE}/api/cognitive/sessions/${userId}`);
};

const getPatientMetrics = (userId: string) => {
  return axios.get(`${API_BASE}/api/cognitive/metrics/${userId}`);
};

const getSessionDetails = (sessionId: string) => {
  return axios.get(`${API_BASE}/api/cognitive/session/${sessionId}`);
};

const PatientService = {
  getPatientsByClinician,
  getPatientById,
  getPatientProfile,
  getPatientTrendData,
  getPatientSessions,
  getPatientMetrics,
  getSessionDetails
};

export default PatientService;
