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
  
  