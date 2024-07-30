import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

const ImageMask = () => {
  const dispatch = useDispatch();
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [imageLink, setImageLink] = useState("");

  const handleMaskClick = () => {
    if (selectedLayer && selectedLayer.content.type === "image") {
      const updatedLayer = {
        width: 50,
        height: 50,
      };
      // dispatch(updateLayer({ id: selectedLayer.id, data: updatedLayer }));
      console.log("selectedLayer.content.banner", selectedLayer.content.banner)
      setImageLink(selectedLayer.content.banner);
    }
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <h4 className="py-2 text-lg font-bold">Mask Image</h4>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="240"
          height="240"
          onClick={handleMaskClick}>
          <defs>
            <clipPath id="circleView">
              <circle cx="120" cy="120" r="100" />
            </clipPath>
          </defs>
          {imageLink ? (
            <image 
              width="240" 
              height="240" 
              xlinkHref={imageLink}
              clipPath="url(#circleView)"
            />
          ) : (
            <g clipPath="url(#circleView)">
              <rect width="240" height="240" fill="black" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ImageMask;
