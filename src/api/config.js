// import axios from 'axios'
// const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// console.log(apiUrl)

// // const instance = axios.create({ baseURL: 'https://apis.ezpics.vn/apis' })
// const instance = axios.create({ baseURL: process.env.VITE_API_URL+'/apis' })
// export default instance
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(apiUrl);

const instance = axios.create({ baseURL: `${apiUrl}/apis` });
export default instance;
