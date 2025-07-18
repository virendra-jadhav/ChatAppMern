import axios from "axios";

const baseUrl = import.meta.env.BASE_URL;
console.log("base url is: " + baseUrl);
const axiosService = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000, // timeout (ms)
  headers: {
    "Content-Type": "application/json",
    // allow cross origin site]
  },
});
export default axiosService;
