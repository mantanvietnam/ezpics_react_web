export const getInforPost = async (data) => {
    const response = await axios.post(
      "https://apis.ezpics.vn/apis/getInfoProductAPI",
      data
    );
    return response.data;
  };
  export const getPost= async (data) => {
    const response = await axios.post(
      "https://apis.ezpics.vn/apis/getMyProductAPI",
      data
    );
    return response.data.listData;
  };
  // export const searchProductAPI = async (data) => {
  //   const response = await axios.post(
  //     "https://apis.ezpics.vn/apis/searchProductAPI",
  //     data
  //   );
  //   return response.data;
  // };