import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLayerImage,
  addLayerText,
  updateLayer,
} from "@/redux/slices/editor/stageSlice";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { addLayerImageUrlAPI } from "@/api/design";
import { Button } from "antd";

// SVG cơ bản
const initialSvgString = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circle-clip">
      <circle cx="100" cy="100" r="100" />
    </clipPath>
  </defs>
  <image
    href="https://via.placeholder.com/200" 
    width="200"
    height="200"
    clip-path="url(#circle-clip)"
  />
</svg>
`;

// Hàm chuyển SVG thành Base64
function svgToBase64(svgString) {
  return btoa(svgString);
}

// Hàm chuyển SVG thành URL Base64
function svgToDataUrl(svgString) {
  const base64 = svgToBase64(svgString);
  return `data:image/svg+xml;base64,${base64}`;
}

// Hàm chuyển URL Base64 thành chuỗi SVG
function dataUrlToSvg(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  return atob(base64);
}

// Hàm để lấy kích thước từ SVG
function getSvgDimensions(svgString) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  const width = svgElement.getAttribute("width") || "0";
  const height = svgElement.getAttribute("height") || "0";
  return {
    naturalWidth: parseInt(width, 10),
    naturalHeight: parseInt(height, 10),
  };
}

const ImageMask = () => {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [imageLink, setImageLink] = useState("");

  // State để lưu chuỗi SVG và URL Base64
  const [svgString, setSvgString] = useState(initialSvgString);

  // Tạo URL từ chuỗi SVG
  const svgUrl = svgToDataUrl(svgString);

  // Component để hiển thị SVG
  const SvgImage = ({ dataUrl }) => {
    // Chuyển URL Base64 thành chuỗi SVG
    const svgString = dataUrlToSvg(dataUrl);

    console.log("svgString", svgString);

    return (
      <div
        dangerouslySetInnerHTML={{ __html: svgString }}
        style={{ width: "200px", height: "200px" }} // Điều chỉnh kích thước nếu cần
      />
    );
  };

  const imgSrcNew =
    "https://apis.ezpics.vn//upload/admin/images/4274/4274_2024_08_03_23_32_53_5893.jpg";

  // Thay đổi ảnh trong SVG và cập nhật chuỗi SVG mới
  const handleChangeImage = (imgSrc) => {
    // Thay đổi ảnh trong SVG với một URL mới
    const newSvgString = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="circle-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <image
        href="${imgSrc}"
        width="200"
        height="200"
        clip-path="url(#circle-clip)"
      />
    </svg>
    `;

    const urlSvgNew = svgToDataUrl(newSvgString);

    const data = {
      ...selectedLayer.content,
      banner: urlSvgNew,
    };

    dispatch(updateLayer({ id: selectedLayer.id, data: data }));
  };

  const handleAddPhoto = async (svgUrl) => {
    // Gửi yêu cầu thêm layer
    const res = await addLayerImageUrlAPI({
      idproduct: stageData.design.id,
      token: checkTokenCookie(),
      imageUrl: svgUrl,
      page: 0,
    });
    dispatch(addLayerText(res.data));
    const { naturalWidth, naturalHeight } = getSvgDimensions(initialSvgString);
    // console.log(res.data);
    const data = {
      ...res.data.content,
      naturalWidth: naturalWidth,
      naturalHeight: naturalHeight,
    };
    dispatch(updateLayer({ id: res.data.id, data: data }));
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <h4 className="py-2 text-lg font-bold">Mask Image</h4>
      <div className="flex flex-col">
        <Button onClick={() => handleAddPhoto(svgUrl)}>
          Test tem svg layer
        </Button>
        <Button
          onClick={() => {
            handleChangeImage(imgSrcNew);
          }}>
          Test them anh vao svg
        </Button>
      </div>
      <img src={selectedLayer?.content?.banner} alt="SVG Banner" />
      <SvgImage dataUrl={selectedLayer?.content?.banner} />
    </div>
  );
};

export default ImageMask;
