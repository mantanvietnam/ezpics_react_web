import axios from "axios";

export const getLogoProductApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getProductByCategoryAPI",
    data
  );
  return response.data;
};

export const getserisProductApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/listProductSeriesAPI",
    data
  );
  return response.data;
};

export const getCollectionProductApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis//searchWarehousesAPI",
    data
  );
  return response.data;
};

export const getMyProductApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getMyProductAPI",
    data
  );
  return response.data;
};

export const getMyProductSeriesAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getMyProductSeriesAPI",
    data
  );
  return response.data;
};

export const deleteProductAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/deleteProductAPI",
    data
  );
  return response.data;
};

export const duplicateProductAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/clonedProductAPI",
    data
  );
  return response.data;
};
