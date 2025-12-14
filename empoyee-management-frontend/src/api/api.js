import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
}, err => Promise.reject(err));

api.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    console.warn("Unauthorized — clearing local storage");
    
  }
  return Promise.reject(err); 
});

export default api;
