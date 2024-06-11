import axiosInstance from "./axiosInstance";
import axios from "axios";

export const getInfoMemberAPI = async (data) => {
    const response = await axiosInstance.post(`/getInfoMemberAPI`, data);
    return response;
}

export const getUserInfoApi = async (data) => {
    const response = await axios.post(
      "https://apis.ezpics.vn/apis/getInfoUserAPI",
      data
    );
    return response.data;
  };