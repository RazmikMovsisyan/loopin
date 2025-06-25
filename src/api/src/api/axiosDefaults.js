import axios from "axios";

axios.defaults.baseURL = "https://loopin-8006788e0f02.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;