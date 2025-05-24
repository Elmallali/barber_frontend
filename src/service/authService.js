import api from "./api"; // axios instance configured with baseURL and headers

// Updated to match the Laravel API routes which are prefixed with /api
const AUTH_URL = "/api/auth";

const login = async (credentials) => {
  const response = await api.post(`${AUTH_URL}/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post(`${AUTH_URL}/register`, userData);
  return response.data;
};

const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/user/me");
    return response.data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    await api.post(`${AUTH_URL}/logout`);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

const authService = {
  login,
  register,
  getCurrentUser,
  logout
};

export default authService;
