import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { enviromnent } from "@/app/enviroment/enviroment";



const api = axios.create({
  baseURL: enviromnent.baseURL
});

api.interceptors.request.use(config => {
  return config;
});

api.interceptors.response.use(
  response => responseInterceptor(response),
  error => errorInterceptor(error)
);

export { api };