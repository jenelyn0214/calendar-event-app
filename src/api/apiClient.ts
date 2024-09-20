import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://calendar-event-api-g-567b28a85c4f.herokuapp.com/api", // Replace with your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get JWT token from localStorage
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page if unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;

