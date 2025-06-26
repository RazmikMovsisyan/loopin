import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "https://loopin-8006788e0f02.herokuapp.com/";

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

export const axiosReq = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL,
  withCredentials: true,
});

axiosReq.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (err) => Promise.reject(err)
);