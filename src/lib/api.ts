import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;

console.log(BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
