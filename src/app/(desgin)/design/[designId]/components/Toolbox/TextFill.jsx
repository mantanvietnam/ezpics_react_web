import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

const TextFill = () => {
  const [color, setColor] = useState("");
  const updateObjectFill = (e, color) => {
    setColor(color);
  };
  const { selectedLayer } = useSelector((state) => state.stage.stageData);

  useEffect(() => {
    if (selectedLayer.content.color !== color) {
      setColor(selectedLayer.content.color);
    }
  }, [selectedLayer, color]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedLayer.id && color !== selectedLayer.content.color) {
      const data = { color: color };
      console.log("🚀 ~ useEffect ~ data:", data);
      dispatch(updateLayer({ id: selectedLayer.id, data }));
    }
  }, [selectedLayer.id, color]);

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <div className="relative">
        <h4 className="py-2">Màu tài liệu</h4>
        <div className="">
          <input
            type="color"
            className="w-12 h-12 appearance-none bg-transparent border-0 cursor-pointer p-0"
            onChange={(e) => updateObjectFill(e, e.target.value)}
          />
          <div className="absolute text-white top-[44px] left-[16px] text-[26px] cursor-pointer">
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFill;
