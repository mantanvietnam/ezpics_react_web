export const setCookie = (name, value, expirationHours) => {
  var date = new Date();
  value = JSON.stringify(value);
  date.setTime(date.getTime() + expirationHours * 60 * 60 * 1000);
  var expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const getCookie = (name) => {
  if (typeof document === "undefined") {
    // Nếu không có document (đang chạy trên server), trả về null hoặc giá trị mặc định
    return null;
  }

  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }

  return decodeURI(dc.substring(begin + prefix.length, end));
};

export function checkTokenCookie() {
  // Kiểm tra xem đang chạy trên client hay không
  // if (typeof document === "undefined") {
  //   console.log("document is not defined");
  //   return null;
  // }
  if (typeof window === "undefined") {
    return null;
  }

  // Lấy tất cả các cookies
  var allCookies = document.cookie;

  // Tách các cookies thành mảng các cặp key-value
  var cookiesArray = allCookies.split("; ");

  // Tìm cookie có tên là "token"
  var tokenCookie;
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i];
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0];
    var cookieValue = cookieParts[1];

    if (cookieName === "token") {
      tokenCookie = cookieValue;
      break;
    }
  }

  // Kiểm tra nếu đã tìm thấy cookie "token"
  if (tokenCookie) {
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
    console.log('Không tìm thấy cookie có tên là "token"');
    return null;
  }
}

export function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}
