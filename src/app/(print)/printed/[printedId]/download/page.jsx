"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import images from "../../../../../../public/images/index2";
import { getImageFromDB } from "../components/indexedDB";
import PrintedIcon from "../icon/PrintedIcon";
import CancelIcon from "../icon/CancelIcon";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "antd";

const DownloadPage = () => {
  const params = useParams();
  const { printedId } = params;
  const router = useRouter();
  const [imageURL, setImageURL] = useState(null);
  const [noteDownload, setNoteDownload] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      const base64Data = await getImageFromDB("my-image-id");
      if (base64Data) {
        setImageURL(base64Data);
      } else {
        console.error("Không tìm thấy ảnh");
      }
    };

    loadImage();
  }, []);

  const handleDownload = () => {
    if (imageURL) {
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "download.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setNoteDownload(true);
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-auto h-screen pt-[70px] mobile:pt-[0] mobile:justify-center items-center bg-[#222831]">
      <div className="logo flex items-center justify-center absolute top-4 left-4 lg:top-6 lg:left-6">
        <Link href="/" className="flex flex-center">
          <Image
            className="object-contain rounded_image"
            priority={true}
            src={images.logo}
            style={{ maxWidth: "40px", maxHeight: "40px" }}
            alt="Ezpics Logo"
          />
        </Link>
      </div>

      <div className="w-[80%] mobile:w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[34%]">
        <div className="mb-4">
          {imageURL ? (
            <img src={imageURL} alt="Ảnh cần tải" className="w-full h-auto" />
          ) : (
            <Skeleton.Image
              active
              style={{
                backgroundColor: "#fff",
                width: "300px",
                height: "300px",
              }}
            />
          )}
          {noteDownload && (
            <div className="text-white mt-4">
              Chú ý! Nếu hình không tự động tải. Ấn giữ hình từ 5 giây trở lên
              để hiển thị tùy chọn tải xuống
            </div>
          )}
        </div>
        <div className="flex">
          <button
            className="flex items-center mt-4 mr-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
            onClick={handleDownload}
          >
            <PrintedIcon size={25} />
            <p className="pl-2">Tải ảnh</p>
          </button>

          <button
            className="flex items-center mt-4 mx-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
            onClick={() => router.push(`/printed/${printedId}`)}
          >
            <CancelIcon size={25} />
            <p className="pl-2">Tạo lại</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
