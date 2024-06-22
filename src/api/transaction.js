import axios from "axios";
export const getDataTransaction = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getHistoryTransactionAPI",
    {
      page: 1,
      token: data,
    }
  );
  return response.data;
};

export const getDataTransactionEcoin = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getHistoryTransactionEcoinAPI",
    {
      page: 1,
      token: data,
    }
  );
  return response.data;
};

export const saveRequestBankingAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/saveRequestBankingAPI",
    data
  );
  return response.data;
};

//Gia han pro theo thang
export const memberExtendProMonthAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/memberExtendProMonthAPI",
    data
  );
  return response.data;
};

//Gia han pro theo nam
export const memberExtendProAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/memberExtendProAPI",
    data
  );
  return response.data;
};

//Dung thu pro theo thang
export const memberBuyProMonthAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/memberBuyProMonthAPI",
    data
  );
  return response.data;
};

//Dung thu pro theo nam
export const memberBuyProAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/memberBuyProAPI",
    data
  );
  return response.data;
};

// Dung thu 7 ngay
export const memberTrialProAPI = async (data) => {
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/memberTrialProAPI",
    data
  );
  return response.data;
};
