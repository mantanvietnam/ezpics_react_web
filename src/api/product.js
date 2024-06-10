import axios from "axios";

export const getNewProducts = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getNewProductAPI",
    data
  );
  return response.data;
};

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
    "https://apis.ezpics.vn/apis/searchWarehousesAPI",
    data
  );
  return response.data;
};

export const getInfoProductApi = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getInfoProductAPI",
    data
  );
  return response.data;
};