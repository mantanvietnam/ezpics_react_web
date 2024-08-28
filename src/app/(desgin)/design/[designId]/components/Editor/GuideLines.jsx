import { Line } from 'react-konva';

export const Guidelines = ({ guidelines }) => {
  return (
    <>
      {guidelines.map((line, index) => (
        <Line
          key={index}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke="red" // Màu sắc của đường căn chỉnh
          strokeWidth={2} // Độ dày của đường căn chỉnh
          dash={[10, 5]} // Định dạng kiểu đường nét đứt
          opacity={0.8} // Độ trong suốt
        />
      ))}
    </>
  );
};