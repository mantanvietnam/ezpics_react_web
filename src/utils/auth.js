import { getCookie } from "./cookie";

export function checkAvailableLogin() {
    var token = getCookie("token");
    var userLogin = getCookie("user_login");
    console.log(token, userLogin);
    if (userLogin == null || token == null) {
        return false;
    } else {
        return true;
    }
}