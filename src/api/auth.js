// 'use server'
import axiosInstance from "./axiosInstance";
// import instance from "./config";

export const register = async (user) => {
   const result = await instance.post('/saveRegisterMemberAPI', user)
   return result
}
//  export const loginByPhone =async (user) => {
//     const result = await instance.post('/checkLoginMemberAPI', user)
//     return result
//  }
//  export const loginByFB = async(user) => {
//     const result = await instance.post('/checkLoginFacebookAPI', user)
//     return result
//  }
//  export const loginByGoogle = async(user) => {
//     const result = await instance.post('/checkLoginGoogleAPI', user)
//     return result
//  }
//  export const loginByApple = async(user) => {
//     const result = await instance.post('/checkLoginAppleAPI', user)
//     return result
//  }
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