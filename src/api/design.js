import axios from "axios";

export const getListLayerApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/listLayerAPI",
    data
  );
  return response.data;
};