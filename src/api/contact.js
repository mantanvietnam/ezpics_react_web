import axios from "axios";

export const saveContactAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/saveContactAPI",
    data
  );
  return response.data;
};
