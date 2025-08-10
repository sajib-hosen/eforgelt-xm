import axios from "axios";
import { store } from "../redux/store/store";

const $api = axios.create({
  baseURL: process.env.SERVER_BASE_URL || "http://localhost:5500", // Replace with your backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

$api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default $api;
