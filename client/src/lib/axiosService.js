import axios from "axios";

const baseUrl = "http://localhost:5000/api/v1";
const axiosService = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000, // timeout (ms)
  headers: {
    "Content-Type": "application/json",
    // allow cross origin site]
  },
});

axiosService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // return Promise.reject(error);
    console.error(
      "error in axios",
      error.response?.data?.message || error.message
    );
    return (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
);
export default axiosService;
