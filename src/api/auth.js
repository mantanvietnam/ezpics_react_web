// 'use server'
import axiosInstance from "./axiosInstance";
// import instance from "./config";

export const register = async (user) => {
   const result = await axiosInstance.post('/saveRegisterMemberAPI', user)
   return result
}
export const getUserDetail = async (data) => {
   const response = await axios.post(
     "https://apis.ezpics.vn/apis/getInfoMemberAPI",
     {
       token: data,
     }
   );
   return response.data;
 };

export const loginByPhone = async (data) => {
   const response = await axiosInstance.post(`/checkLoginMemberAPI`, data);
   return response;
};
export const logoutService = async (data) => {
   const response = await axiosInstance.post(`/logoutMemberAPI`, data);
   return response;
}