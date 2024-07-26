import axios from "axios";

export const getListLayerApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/listLayerAPI",
    data
  );
  return response.data;
};

export const addLayerImageUrlAPI = async (data) => {
  const response = await axios.post(
    " https://apis.ezpics.vn/apis/addLayerImageUrlAPI",
    data
  );
  return response.data;
};

export const addLayerTextAPI = async (data) => {
  const response = await axios.post(
    " https://apis.ezpics.vn/apis/addLayerText",
    data
  );
  return response.data;
};

export const deleteLayerAPI = async (data) => {
  const response = await axios.post(
    " https://apis.ezpics.vn/apis/deleteLayerAPI",
    data
  );
  return response.data;
};

export const saveListLayer = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/updateListLayerAPI",
    data
  );
  return response.data;
};

export const downloadListLayer = async (data) => {
  const response = await axios.get("https://apis.ezpics.vn/apis/createThumb", {
    params: data,
  });
  return response.data;
};

export const updateDesign = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/updateProductAPI",
    data
  );
  return response.data;
};
