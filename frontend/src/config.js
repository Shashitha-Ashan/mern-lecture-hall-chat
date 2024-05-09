const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://example.com/api";

const API_ENDPOINTS = {
  getUsers: `${API_BASE_URL}/users`,
  getPosts: `${API_BASE_URL}/posts`,
  // Add more endpoints as needed
};

export default API_ENDPOINTS;
