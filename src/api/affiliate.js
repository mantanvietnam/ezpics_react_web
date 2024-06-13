import axios from "axios";

export const listUserGetAffsource = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/listUserGetAffsource",
    data
  );
  return response.data;
};
