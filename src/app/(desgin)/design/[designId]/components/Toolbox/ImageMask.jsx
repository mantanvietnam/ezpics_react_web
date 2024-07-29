import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

const ImageMask = () => {
  const dispatch = useDispatch();
  const { selectedLayer } = useSelector((state) => state.stage.stageData);

  const handleMaskClick = () => {
    console.log("btn mask");
    if (selectedLayer && selectedLayer.content.type === "image") {
      // Cập nhật layer để đặt hình ảnh vào khung
      const updatedLayer = {
        postion_left: 0, // Cập nhật vị trí x
        postion_top: 0, // Cập nhật vị trí y
        width: 50,
        height: 50,
      };
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedLayer }));
    }
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <h4 className="py-2 text-lg font-bold">Mask Image</h4>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          onClick={handleMaskClick}>
          <defs>
            <clipPath id="clip-0.49034285747025574">
              <path d="M 0 0 L 300 0 L 300 300 L 0 300 Z" />
            </clipPath>
          </defs>

          {/* <!-- Path for the fill --> */}
          <path
            d="M 0 0 L 300 0 L 300 300 L 0 300 Z"
            fill="lightgray"
            transform="scale(1, 1)"
          />

          {/* <!-- Path for the stroke, clipped by the star path --> */}
          <path
            d="M 0 0 L 300 0 L 300 300 L 0 300 Z"
            fill="none"
            stroke="#0c0c0c"
            stroke-width="0"
            clip-path="url(#clip-0.49034285747025574)"
            transform="scale(1, 1)"
            stroke-dasharray=""
          />
        </svg>
      </div>
    </div>
  );
};

export default ImageMask;
