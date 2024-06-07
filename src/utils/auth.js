import { getCookie } from "./cookie";

export function checkAvailableLogin() {
    var token = getCookie("token");
    var userLogin = getCookie("user_login");
    // Phải có api check xem token còn dùng được không
    if (userLogin == null || token == null) {
        return false;
    } else {
        return true;
    }
}