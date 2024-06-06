import axios from "axios";

export const register = (user ) => {
    return axios.post('https://apis.ezpics.vn/apis/saveRegisterMemberAPI', user)
 }
 export const loginByPhone = (user) => {
    return axios.post('https://apis.ezpics.vn/apis/checkLoginMemberAPI', user)
 }
 export const loginByFB = (user) => {
    return axios.post('https://apis.ezpics.vn/apis/checkLoginFacebookAPI', user)
 }
 export const loginByGoogle = (user) => {
    return axios.post('https://apis.ezpics.vn/apis/checkLoginGoogleAPI', user)
 }
 export const loginByApple = (user) => {
    return axios.post('https://apis.ezpics.vn/apis/checkLoginAppleAPI', user)
 }