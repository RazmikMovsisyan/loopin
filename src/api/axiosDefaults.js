import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = "https://loopin-8006788e0f02.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create({
  baseURL: "https://loopin-8006788e0f02.herokuapp.com/",
  withCredentials: true,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
});

export const axiosRes = axios.create({
  baseURL: "https://loopin-8006788e0f02.herokuapp.com/",
  withCredentials: true,
});
