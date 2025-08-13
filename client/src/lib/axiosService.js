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
    // return error.response?.status == 413
    //   ? {
    //       success: false,
    //       message: error.message,
    //       status: error.response?.status,
    //     }
    //   : error.response?.data;

    return Promise.reject(
      error.response?.status == 413
        ? {
            success: false,
            message: error.message,
            status: error.response?.status,
          }
        : error.response?.data
    );
  }
);
export default axiosService;
