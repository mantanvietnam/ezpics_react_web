/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
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

  return (
    <>
      <div className="absolute top-0 left-[100px] h-full w-[300px] overflow-y-scroll">
        <div className="px-4 py-4">
          <h4 className="py-2">Ảnh tải lên</h4>
          <button className="w-[100%] bg-black rounded-lg border border-transparent text-white px-4 py-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300">
            Chọn ảnh từ máy
          </button>
        </div>
        <div className="px-4">
          <h4>Ảnh đã tải lên</h4>
          <div className="grid gap-2 grid-cols-2">
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
  );
}

export default Photos;
