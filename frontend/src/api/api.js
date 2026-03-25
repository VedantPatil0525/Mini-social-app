import axios from "axios";

const API = axios.create({
  baseURL: "https://mini-social-app-8cq1.onrender.com/api"
});

export default API;