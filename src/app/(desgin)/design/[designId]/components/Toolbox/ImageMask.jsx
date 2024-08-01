import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import NextImage from "next/image";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { addLayerImageUrlAPI } from "@/api/design";
import { addLayerImage, addLayerText } from "@/redux/slices/editor/stageSlice";

const ImageMask = () => {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { selectedLayer } = stageData;

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

  const dataUrl =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIgdmlld0JveD0iMCAwIDEwODAgMTA4MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNS4yLjQ8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgNTQwIDU0MCkiIGlkPSI4Zjc1NDQwNC0xMDQyLTRmMTMtYTI2Ny0yMDBkOTYzNDZjNWUiICA+CjxyZWN0IHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiBoaWRkZW47IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiICB4PSItNTQwIiB5PSItNTQwIiByeD0iMCIgcnk9IjAiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiIC8+CjwvZz4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSA1NDAgNTQwKSIgaWQ9ImJiMDM3ZWIzLTUwZWMtNDA1Mi04Y2RhLWEwOWUxNTZkMzY5MyIgID4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxMy4xNyAwIDAgMTMuMTcgNTQwIDU0MCkiIGlkPSIxYWQ5NDVjNi1mYmUxLTRlYmYtYmJjMy1iMDQ0MGQ2MzRlZGMiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IHJnYigwLDAsMCk7IHN0cm9rZS13aWR0aDogMDsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDAsMCwwKTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC01MCwgLTUwKSIgZD0iTSA5MC4zNzUgOTAuMzc1IEwgOS42MjUgOTAuMzc1IEwgOS42MjUgOS42MjUgTCA5MC4zNzUgOS42MjUgTCA5MC4zNzUgOTAuMzc1IHogTSAxMS42MjUgODguMzc1IEwgODguMzc1IDg4LjM3NSBMIDg4LjM3NSAxMS42MjUgTCAxMS42MjUgMTEuNjI1IEwgMTEuNjI1IDg4LjM3NSB6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+";

  const handleAddPhoto = async () => {
    try {
      // Tạo đối tượng hình ảnh mới
      const img = new Image();
      img.src = dataUrl;

      img.onload = async () => {
        // Khi hình ảnh đã tải xong
        const imageWidth = img.width;
        const imageHeight = img.height;

        if (imageWidth > 0 && imageHeight > 0) {
          // Gửi yêu cầu thêm layer
          const res = await addLayerImageUrlAPI({
            idproduct: stageData.design.id,
            token: checkTokenCookie(),
            imageUrl: dataUrl,
            page: 0,
          });
          dispatch(addLayerText(res.data));
        } else {
          console.error("Hình ảnh có kích thước không hợp lệ.");
        }
      };

      img.onerror = (error) => {
        console.error("Lỗi tải hình ảnh:", error);
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <h4 className="py-2 text-lg font-bold">Mask Image</h4>
      <button onClick={handleAddPhoto}>Test them anh svg</button>
      <div>
        <NextImage alt="" src={dataUrl} width={50} height={50} />
      </div>
    </div>
  );
};

export default ImageMask;
