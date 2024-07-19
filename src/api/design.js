import axios from "axios";

export const getListLayerApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/listLayerAPI",
    data
  );
  return response.data;
}

export const addLayerImageUrlAPI = async (data) => {
  const response = await axios.post(
    " https://apis.ezpics.vn/apis/addLayerImageUrlAPI",
    data
  );
  return response.data;
}

export const deleteLayerAPI = async (data) => {
  const response = await axios.post(
    " https://apis.ezpics.vn/apis/deleteLayerAPI",
    data
  );
  return response.data;
}