import React, { useEffect, useState } from "react";
import Photo from "../../Icon/Photo";
import { checkTokenCookie } from "@/utils";
import axios from "axios";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `https://apis.ezpics.vn/apis/listImage`,
          {
            token: checkTokenCookie(),
          }
        );
        setPhotos(response.data.data.reverse());
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error);
      }
    }

    fetchData();
  }, []);

  console.log(photos);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "100px",
          height: "100%",
          width: "300px",
          paddingTop: "94px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}>
        <div style={{ padding: "0 1.5rem" }}>
          <div>Ảnh đã tải lên</div>
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: "1fr 1fr",
            }}>
            {photos?.map((item, index) => {
              return (
                <ImageItem key={index} preview={`${item.link}`} item={item} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

function ImageItem({ preview, onClick, onContextMenu, item }) {
  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        className="relative bg-[#f8f8fb] cursor-pointer rounded-lg overflow-hidden hover:before:opacity-100">
        <div className="absolute inset-0 h-full w-full"></div>
        <img
          src={preview}
          alt=""
          className="w-full h-full object-contain pointer-events-none align-middle"
        />
      </div>
    </>
  );
}

export default Photos;
