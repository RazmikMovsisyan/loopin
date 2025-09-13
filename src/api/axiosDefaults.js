import axios from "axios";

const local = false;

axios.defaults.baseURL = local ? "http://localhost:8000" : "https://loopin-8006788e0f02.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();