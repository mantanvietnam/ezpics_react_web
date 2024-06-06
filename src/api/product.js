import axios from 'axios'

export const getLogoProductApi = async (data) => {
  const response = await axios.post('https://apis.ezpics.vn/apis/getProductByCategoryAPI', data)
  return response.data
}

export const getserisProductApi = async (data) => {
  const response = await axios.post('https://apis.ezpics.vn/apis/listProductSeriesAPI', data)
  return response.data
} 