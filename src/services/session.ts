import axios from "axios";
import { API_BASE } from "./config";

const addSession = (data) => {
  return axios.post(API_BASE + "/session", data);
};

const getUserSessions = (user_id) => {
  return axios.get(API_BASE + `/sessions/${user_id}`);
};
const getUserSession = (user_id, session_id) => {
  return axios.get(API_BASE + `/sessions/${user_id}/${session_id}`);
};

const SessionService = {
  addSession,
  getUserSessions,
  getUserSession,
};

export default SessionService;
