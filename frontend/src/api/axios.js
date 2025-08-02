import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Reads your API base URL from env
  withCredentials: true, // Important: sends cookies with every request
});

export default api;