import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

const basicColors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#000000", // Black
  "#FFFFFF", // White
];

const TextFill = () => {
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [color, setColor] = useState(selectedLayer.content.color);

  useEffect(() => {
    setColor(selectedLayer.content.color);
  }, [selectedLayer]);

  const dispatch = useDispatch();

  // Ref để lưu timeout
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (selectedLayer.id && color !== selectedLayer.content.color) {
      // Hủy timeout cũ nếu có
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Tạo timeout mới
      debounceTimeout.current = setTimeout(() => {
        const data = { color };
        dispatch(updateLayer({ id: selectedLayer.id, data }));
      }, 300); // Thay đổi 300ms tùy theo nhu cầu của bạn
    }
  }, [selectedLayer.id, color, dispatch]);

  const updateObjectFill = (color) => {
    setColor(color);
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <div className="relative">
        <h4 className="py-2">Màu tài liệu</h4>
        <div className="flex items-center gap-2 mb-4 relative">
          <input
            type="color"
            value={color}
            className="w-12 h-12 appearance-none border border-transparent rounded-lg cursor-pointer p-0 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
            onChange={(e) => updateObjectFill(e.target.value)}
            style={{ boxShadow: `0 0 0 4px ${color} inset` }}
          />
        </div>
        <h4 className="py-2">Màu hay dùng</h4>
        <div className="grid grid-cols-4 gap-2">
          {basicColors.map((basicColor) => (
            <div
              key={basicColor}
              className="w-12 h-12 border rounded-lg cursor-pointer"
              style={{ backgroundColor: basicColor }}
              onClick={() => updateObjectFill(basicColor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextFill;
