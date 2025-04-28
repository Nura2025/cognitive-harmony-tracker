import axios from "axios";
import { API_BASE } from "./config"; // Make sure this points to your backend URL

const getPatientsByClinician = (clinicianId: string) => {
  return axios.get(`${API_BASE}/${clinicianId}/patients`);
};

const getPatientById = (clinicianId: string, patientId: string) => {
  return axios.get(`${API_BASE}/${clinicianId}/patients/${patientId}`);
};
const getPatientProfile = (userId: string) => {
  return axios.get(`/api/cognitive/profile/${userId}`);
};
const PatientService = {
  getPatientsByClinician,
  getPatientById,
  getPatientProfile,
};

export default PatientService;
