import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLayerImage } from "@/redux/slices/editor/stageSlice";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { addLayerImageUrlAPI } from "@/api/design";
import {
  getSVGDefinitions,
  getSVGSampleDefinitions,
  SVG_TYPES,
} from "../../../../../../../public/svg/svgDefinitions";

const dataURLToBlob = (dataURL) => {
  // Check if the dataURL is valid
  if (!dataURL || typeof dataURL !== "string") {
    throw new Error("Invalid data URL");
  }

  const [header, data] = dataURL.split(",");

  // Ensure the header part is correctly formatted
  if (!header || !data) {
    throw new Error("Invalid data URL format");
  }

  // Extract MIME type from the header
  const mimeMatch = header.match(/data:(.*?);base64/);
  if (!mimeMatch || !mimeMatch[1]) {
    throw new Error("Invalid MIME type");
  }

  const mime = mimeMatch[1];
  const binary = atob(data);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mime });
};

const ImageMask = () => {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [imageLink, setImageLink] = useState("");
  const [svgType, setSvgType] = useState("circle");

  const handleMaskClick = async (type) => {
    setSvgType(type);
    try {
      const svgString = createSVGString(selectedLayer.content.banner, type);
      const imageBlob = dataURLToBlob(svgStringToDataURL(svgString));

      const token = checkTokenCookie();
      const formData = new FormData();
      if (token) {
        formData.append("idproduct", stageData.design.id);
        formData.append("token", token);
        formData.append("idlayer", stageData.selectedLayer.id);
        formData.append("file", imageBlob);

        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "multipart/form-data",
        };

        const config = {
          headers: headers,
        };

        const response = await axios.post(
          "https://apis.ezpics.vn/apis/changeLayerImageNew",
          formData,
          config
        );

        console.log(response);
        setImageLink(selectedLayer.content.banner);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSVGString = (imageUrl, type) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
        <defs>
          ${
            type === "circle"
              ? '<clipPath id="circleView"><circle cx="120" cy="120" r="100" /></clipPath>'
              : ""
          }
          ${
            type === "rect"
              ? '<clipPath id="rectView"><rect x="20" y="20" width="200" height="200" /></clipPath>'
              : ""
          }
          ${
            type === "star"
              ? '<clipPath id="starView"><polygon points="120,20 140,80 200,80 150,120 170,180 120,140 70,180 90,120 40,80 100,80" /></clipPath>'
              : ""
          }
        </defs>
        <image width="240" height="240" xlinkHref="${imageUrl}" clipPath="url(#${type}View)" />
      </svg>
    `;
  };

  const svgStringToDataURL = (svgString) => {
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
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
      <div className="mb-2">
        <label className="mr-2">Select SVG Type:</label>
        <div className="flex space-x-4">
          {SVG_TYPES.map(({ type, name }) => (
            <div
              key={type}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleMaskClick(type)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                style={{
                  border: svgType === type ? "2px solid blue" : "none",
                }}>
                <defs>{getSVGSampleDefinitions(type)}</defs>
                <g clipPath={`url(#${type}SampleView)`}>
                  <rect width="80" height="80" fill="black" />
                </g>
              </svg>
              <span className="text-sm mt-1">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="240"
          height="240"
          viewBox="0 0 240 240"
          onClick={() => handleMaskClick(svgType)}>
          <defs>{getSVGDefinitions(svgType)}</defs>
          {imageLink ? (
            <image
              width="240"
              height="240"
              xlinkHref={imageLink}
              clipPath={`url(#${svgType}View)`}
            />
          ) : (
            <g clipPath={`url(#${svgType}View)`}>
              <rect width="240" height="240" fill="black" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ImageMask;
