export const getLayersByPage = (layers, pageIndex) => {
  return layers.filter(layer => layer.content.page == pageIndex);
}; 

export const calculateTotalPages = (layers) => {
  // Tìm giá trị page lớn nhất trong mảng layers
  const maxPage = layers.reduce((max, layer) => {
    return Math.max(max, layer.content.page);
  }, 0);

  // Tổng số trang sẽ là giá trị lớn nhất cộng thêm một
  return maxPage + 1;
};