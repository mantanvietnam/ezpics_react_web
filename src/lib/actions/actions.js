export const getNewProducts = async () => {
  return fetch("https://apis.ezpics.vn/apis/getNewProductAPI").then((res) =>
    res.json()
  );
};

export const getTrendingProducts = async () => {
  return fetch("https://apis.ezpics.vn/apis/listTrendProductAPI").then((res) =>
    res.json()
  );
};

export const getSeriesProducts = async () => {
  return fetch("https://apis.ezpics.vn/apis/listProductSeriesAPI").then((res) =>
    res.json()
  );
};

import axios from "axios";

export const getProductByCategory = async (
  category_id,
  orderBy,
  orderType,
  limit,
  page,
  color
) => {
  try {
    const response = await axios.post(
      "https://apis.ezpics.vn/apis/getProductByCategoryAPI",
      {
        category_id,
        orderBy,
        orderType,
        limit,
        page,
        color,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
