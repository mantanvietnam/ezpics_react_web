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

export const searchProductAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/searchProductAPI",
    data
  );
  return response.data;
};

export const getProductsWarehousesAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getProductsWarehousesAPI",
    data
  );
  return response.data;
};

export const searchWarehousesAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/searchWarehousesAPI",
    data
  );
  return response.data;
};

export const getProductCategoryAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getProductCategoryAPI",
    data
  );
  return response.data;
};
export const getSizeProductAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getSizeProductAPI",
    data
  );
  return response.data;
};

export const getListBuyWarehousesAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getListBuyWarehousesAPI",
    data
  );
  return response.data;
};

export const getListWarehouseDesignerAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getListWarehouseDesignerAPI",
    data
  );
  return response.data;
};

export const addWarehouseAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/addWarehouseAPI",
    data
  );
  return response.data;
};

export const checkFavoriteAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/checkFavoriteProductAPI",
  data
  );
  return response.data;
};

export const getMyProductFavoriteAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getMyProductFavoriteAPI",
    data 
  );
    return response.data;
};

export const saveFavoriteAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/saveFavoriteProductAPI",
    data
  );
  return response.data;
};

export const deleteFavoriteAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/deleteFavoriteProductAPI",
    data
  );
  return response.data;
};

export const buyProductAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/buyProductAPI",
    data
  );
  return response.data;
};