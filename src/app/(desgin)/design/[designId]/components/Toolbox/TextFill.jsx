import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deselectLayer,
  updateLayer,
  updatePageLayerText,
  selectLayer,
} from "@/redux/slices/editor/stageSlice";
import { Tooltip } from "antd";
import axios from "axios";
import { checkTokenCookie } from "@/utils";

const basicColors = [
  "#000000",
  "#737373",
  "#A6A6A6",
  "#FFFFFF",
  "#FF3131",
  "#FF66C4",
  "#8C52FF",
  "#5E17EB",
  "#0097B2",
  "#0CC0DF",
  "#38B6FF",
  "#004AAD",
  "#00BF63",
  "#7EF957",
  "#FFDE59",
  "#FF914D",
];

const TextFill = () => {
  const { selectedLayer, design } = useSelector(
    (state) => state.stage.stageData
  );
  const [color, setColor] = useState("");
  const dispatch = useDispatch();

  // Ref lưu ID layer trước đó và màu của layer hiện tại
  const prevLayerIdRef = useRef(selectedLayer?.id);
  const prevColorRef = useRef(color);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (selectedLayer?.content?.type === "text") {
      // Chỉ cập nhật màu khi layer hiện tại khác layer trước đó

      setColor(selectedLayer.content.color);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.id) {
      // Clear the previous timeout if it exists
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set a new timeout to debounce the update
      debounceTimeout.current = setTimeout(() => {
        // Create a new data object with the updated color and other existing properties
        const data = { ...selectedLayer.content, color: color };

        // Dispatch the updateLayer action with the updated data
        dispatch(updateLayer({ id: selectedLayer.id, data }));

        // Optionally update the reference if you are keeping track of previous values
        // prevColorRef.current = color;
      }, 300); // Adjust the debounce delay according to your needs

      // saveLayerColor(selectedLayer, color);
    }
    // dispatch(selectLayer({ id: selectedLayer.id }));
  }, [color, dispatch, selectedLayer]); // Adding `selectedLayer.content` to dependencies

  const saveLayerColor = async (layer, newColor) => {
    const res = await axios.post("https://apis.ezpics.vn/apis/updateLayerAPI", {
      idproduct: design.id,
      token: checkTokenCookie(),
      field: "color",
      value: newColor,
      idlayer: layer.id,
    });
  };

  const updateObjectFill = (color) => {
    setColor(color);
  };

  const triggerColorPicker = () => {
    document.getElementById("colorPicker").click();
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <div className="relative">
        <div className="flex items-center">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="m6.31 8.25 3.94-3.94V8a.25.25 0 0 1-.25.25zm-.81 12V9.75H10A1.75 1.75 0 0 0 11.75 8V3.5h4.5a.25.25 0 0 1 .25.25V7A.75.75 0 0 0 18 7V3.75A1.75 1.75 0 0 0 16.25 2h-5.086c-.464 0-.909.184-1.237.513L4.513 7.927A1.75 1.75 0 0 0 4 9.164V20.25c0 .967.784 1.75 1.75 1.75H10a.75.75 0 0 0 0-1.5H5.75a.25.25 0 0 1-.25-.25zm17-5.75c0 2.13-.996 4.202-3.423 4.202h-1.459a.3.3 0 0 0-.244.474l.067.093c.06.084.122.169.177.257.137.219.225.448.268.677.206 1.082-.576 2.145-1.799 1.911-2.983-.571-5.515-2.288-5.978-5.425-.742-5.033 3.53-8.71 8.245-7.446 2.274.61 4.146 2.366 4.146 5.257zm-1.5 0c0 .862-.206 1.58-.528 2.037-.276.392-.677.666-1.395.666h-1.459c-1.465 0-2.31 1.653-1.467 2.841.033.047.065.09.095.13.121.162.208.279.18.389-.023.088-.186.053-.264.036l-.011-.002c-2.519-.54-4.234-1.927-4.558-4.127-.584-3.962 2.696-6.764 6.373-5.778C19.722 11.163 21 12.422 21 14.5zm-5.5-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          <h4 className="py-2 px-2">Màu tài liệu</h4>
        </div>
        <div className="flex items-center gap-2 mb-4 relative">
          <Tooltip title="Chọn màu chữ" placement="bottom">
            <div className="flex items-center justify-center relative rounded-full">
              <button
                className="w-12 h-12 rounded-full bg-white border-8 border-gradient-7 flex items-center justify-center text-2xl text-gray-600"
                onClick={triggerColorPicker}
              >
                +
              </button>
              {/* Input color picker ẩn */}
              <input
                id="colorPicker"
                type="color"
                value={color}
                className="absolute w-0 h-0 opacity-0 cursor-pointer"
                onChange={(e) => updateObjectFill(e.target.value)}
                style={{ boxShadow: `0 0 0 4px ${color} inset` }}
              />
            </div>
          </Tooltip>
        </div>

        <div className="flex items-center">
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M10.235 9.19a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zM14.235 8.99a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zm2.317 3.2A1.5 1.5 0 1 1 17 9.224a1.5 1.5 0 0 1-.448 2.966z"
              fill="currentColor"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.586 3v.015c4.749.06 8.63 3.52 8.63 7.854a5.202 5.202 0 0 1-5.195 5.195H14.44a.575.575 0 0 0-.435.962 2.085 2.085 0 0 1-1.542 3.478h-.005a8.755 8.755 0 0 1 0-17.5l.13-.004zM7.51 6.73a7.255 7.255 0 0 1 4.955-2.216c4.035.001 7.242 2.88 7.242 6.355a3.693 3.693 0 0 1-3.685 3.695h-1.58a2.084 2.084 0 0 0-1.554 3.458l.007.007a.576.576 0 0 1-.428.985A7.255 7.255 0 0 1 7.509 6.73z"
              fill="currentColor"
            ></path>
          </svg>
          <h4 className="py-2 px-2">Màu sắc mặc định</h4>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {basicColors.map((basicColor) => (
            <div
              key={basicColor}
              className="w-12 h-12 border rounded-full cursor-pointer transition-all duration-100 hover:shadow-lg hover:border-gray-400 hover:border-2 p-0 hover:p-[2px]"
              onClick={() => updateObjectFill(basicColor)}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: basicColor }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextFill;
