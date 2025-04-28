import axios from "axios";
import { API_BASE } from "./config";

const login = (data) => {
  return axios.post(API_BASE + "/login", data);
};

const registerAsPatient = (data) => {
  return axios.post(API_BASE + "/register/patient ", data);
};
const registerAsClinician = (data) => {
  return axios.post(API_BASE + "/register/clinician ", data);
};

const AuthService = {
  login,
  registerAsPatient,
  registerAsClinician,
};

export default AuthService;
