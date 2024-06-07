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

export const register = (user) => {
   return axios.post('https://apis.ezpics.vn/apis/saveRegisterMemberAPI', user)
}
// export const loginByPhone = (user) => {
//    return axios.post('https://apis.ezpics.vn/apis/checkLoginMemberAPI', user)
// }
export const loginByFB = (user) => {
   return axios.post('https://apis.ezpics.vn/apis/checkLoginFacebookAPI', user)
}
export const loginByGoogle = (user) => {
   return axios.post('https://apis.ezpics.vn/apis/checkLoginGoogleAPI', user)
}
export const loginByApple = (user) => {
   return axios.post('https://apis.ezpics.vn/apis/checkLoginAppleAPI', user)
}
export const loginByPhone = async (data) => {
   try {
      const response = await axiosInstance.post(`${process.env.API_ROOT}/checkLoginMemberAPI`, data);
      if (response.status === 201) {
         return response.data;
      } else {
         console.error('Failed to save user data to external API:', response.status, response.statusText);
         throw new Error(`Failed with status: ${response.status}`);
      }
   } catch (error) {
      console.error('Error saving user data to external API:', error);
      throw error;
   }
};