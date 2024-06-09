import { getCookie } from "./cookie";

export function checkAvailableLogin() {
    var token = getCookie("token");
    // Phải có api check xem token còn dùng được không
    if (token == null) {
        return false;
    } else {
        return true;
    }
}