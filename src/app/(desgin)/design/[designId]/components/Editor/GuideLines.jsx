import React from 'react';
import { Line } from 'react-konva';

const GuideLines = ({ x, y, width, height, stageWidth, stageHeight }) => {
  const getCenter = (x, y, width, height) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    return { centerX, centerY };
  };

  const { centerX, centerY } = getCenter(x, y, width, height);

  return (
    <>
      {/* Vertical guide */}
      <Line points={[centerX, 0, centerX, stageHeight]} stroke="blue" strokeWidth={1} dash={[4, 4]} />

      {/* Horizontal guide */}
      <Line points={[0, centerY, stageWidth, centerY]} stroke="blue" strokeWidth={1} dash={[4, 4]} />
    </>
  );
};

export default GuideLines;
