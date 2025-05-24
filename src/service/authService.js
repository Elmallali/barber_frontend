import api from "./api"; // axios instance configured with baseURL and headers

const AUTH_URL = "/auth";

const login = async (credentials) => {
  const response = await api.post(`${AUTH_URL}/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post(`${AUTH_URL}/register`, userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
