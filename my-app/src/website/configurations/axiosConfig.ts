import axios, { AxiosError } from "axios";
import { Log } from "../../utils/Log";
import ResponseObject from "../dto/ResponseObject";

export const AppAxios = axios.create();
export const AppAxiosConfig = {
  logError: true,
  logResponse: false,
  logRequest: false,
}

AppAxios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  if (AppAxiosConfig.logError) {
    Log.error("Request", JSON.stringify(error.response!.data, null, 2));
  }

  return Promise.reject(error);
});

AppAxios.interceptors.response.use(function (response) {

  return response;
}, function (error: AxiosError<ResponseObject<null>>) {
  if (AppAxiosConfig.logError) {
    Log.error("Response", JSON.stringify(error.response!.data, null, 2));
  }

  return Promise.reject(error);
});