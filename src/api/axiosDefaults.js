// src/api/axiosDefaults.js
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "https://loopin-8006788e0f02.herokuapp.com/";

export const axiosReq = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL,
  withCredentials: true,
});

const methodsRequiringCSRF = ["post", "put", "patch", "delete"];

axiosReq.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get("csrftoken");
    const method = config.method?.toLowerCase();

    if (csrfToken && methodsRequiringCSRF.includes(method)) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (err) => Promise.reject(err)
);
