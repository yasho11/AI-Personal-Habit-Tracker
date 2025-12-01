import axios from "axios";


const api = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: api,
  withCredentials: true,
})