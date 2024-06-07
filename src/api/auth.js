// 'use server'
// import axios from "axios";
// import instance from "./config";

// export const register = async (user ) => {
//     const result = await instance.post('/saveRegisterMemberAPI', user)
//     return result
//  }
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
import axios from "axios";
import axiosInstance from "./axiosInstance";

export const loginByPhone = async (data) => {
   const response = await axiosInstance.post(`/checkLoginMemberAPI`, data);
   return response;
};