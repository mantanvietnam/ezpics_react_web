const FormData = require('form-data'); // npm install --save form-data
const fs = require('fs'); // npm install
const axios = require('axios'); // npm install
const form = new FormData();
// form.append('image', fs.createReadStream("https://imagevietnam.vn/images_cp/123232_1920x650.jpg"));
form.append('token', "")
const request_config = {
  headers: {
    // 'Authorization': `Bearer ${access_token}`,
    ...form.getHeaders()
  }
};

const res = axios.post("https://apis.ezpics.vn/apis/removeBackgroundImageAPI", form, request_config).then(ress => {
console.log(ress);
})
