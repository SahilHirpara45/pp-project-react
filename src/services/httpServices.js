import axios from "axios";

export const baseUrl = process.env.BASE_URL;
let AxiosCreator;

if (typeof window !== "undefined") {
  AxiosCreator = axios.create({
    baseURL: "https://api.pixtun.com",
    // baseURL: "https://test.pixtun.com",
  });

  // AxiosCreator.interceptors.request.use((config) => {
  //   config.headers["Authorization"] =
  //     "Bearer " + localStorage?.getItem("accessToken") || "";
  //   return config;
  // });

  // AxiosCreator.interceptors.response.use(
  //   (res) => {
  //     return res;
  //   },
  //   (err) => {
  //     if (err?.response?.status === 401) {
  //       console.log("401 err : ", err);
  //       window.location.href = "/login";
  //     }

  //     throw err?.response;
  //   }
  // );
}

export default AxiosCreator;
