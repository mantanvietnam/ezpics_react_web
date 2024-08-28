import { Line } from 'react-konva';

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

export function drawGuides(layer, otherLayers, stageWidth, stageHeight) {
  const guides = [];
  const threshold = 5; // Ngưỡng để hiển thị thước đo

  otherLayers.forEach((otherLayer) => {
    if (layer !== otherLayer) {
      const { nearLeft, nearRight, nearTop, nearBottom, nearCenterX, nearCenterY } = isNear(layer, otherLayer, threshold);

      // Thước dọc căn trái/phải
      if (nearLeft || nearRight) {
        guides.push(
          <Line
            points={[layer.x, 0, layer.x, stageHeight]} // Dọc theo trục y
            stroke="red"
            strokeWidth={1}
            dash={[4, 6]}
          />
        );
      }

      // Thước ngang căn trên/dưới
      if (nearTop || nearBottom) {
        guides.push(
          <Line
            points={[0, layer.y, stageWidth, layer.y]} // Dọc theo trục x
            stroke="red"
            strokeWidth={1}
            dash={[4, 6]}
          />
        );
      }

      // Thước căn giữa theo chiều ngang
      if (nearCenterX) {
        guides.push(
          <Line
            points={[layer.x + layer.width / 2, 0, layer.x + layer.width / 2, stageHeight]}
            stroke="green"
            strokeWidth={1}
            dash={[4, 6]}
          />
        );
      }

      // Thước căn giữa theo chiều dọc
      if (nearCenterY) {
        guides.push(
          <Line
            points={[0, layer.y + layer.height / 2, stageWidth, layer.y + layer.height / 2]}
            stroke="green"
            strokeWidth={1}
            dash={[4, 6]}
          />
        );
      }
    }
  });

  return guides;
}

export function isNear(a, b, threshold) {
  const ax = a.getX();
  const ay = a.getY();
  const aw = a.getWidth();
  const ah = a.getHeight();

  const bx = b.getX();
  const by = b.getY();
  const bw = b.getWidth();
  const bh = b.getHeight();

  const nearLeft = Math.abs(ax - (bx + bw)) <= threshold;
  const nearRight = Math.abs(ax + aw - bx) <= threshold;
  const nearTop = Math.abs(ay - (by + bh)) <= threshold;
  const nearBottom = Math.abs(ay + ah - by) <= threshold;
  const nearCenterX = Math.abs(ax + aw / 2 - (bx + bw / 2)) <= threshold;
  const nearCenterY = Math.abs(ay + ah / 2 - (by + bh / 2)) <= threshold;

  return { nearLeft, nearRight, nearTop, nearBottom, nearCenterX, nearCenterY };
}
