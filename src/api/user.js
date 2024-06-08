import axiosInstance from "./axiosInstance";

export const getInfoMemberAPI = async (data) => {
    const response = await axiosInstance.post(`/getInfoMemberAPI`, data);
    return response;
}