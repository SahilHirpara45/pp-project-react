import axios from "axios";
import AxiosCreator, { baseUrl } from "./httpServices";

export const GET = async (url, options) => {
  try {
    const res = await AxiosCreator.get(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage?.getItem("pixtunToken")}` || "",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const POST = async (url, payload) => {
  try {
    const res = await AxiosCreator.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage?.getItem("pixtunToken")}` || "",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const FORM_DATA_POST = async (url, payload) => {
  try {
    const res = await axios({
      method: "post",
      url: `${baseUrl}${url}`,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage?.getItem("accessToken") || "",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const PUT = async (url, payload) => {
  try {
    const res = await AxiosCreator.put(url, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const DELETE = async (url) => {
  try {
    const res = await AxiosCreator.delete(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
