"use client";
import React, { useState, useRef } from "react";
import Compressor from "compressorjs";
import ReactCompareImage from "react-compare-image";
import { Download, Upload } from "lucide-react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CustomHandle = () => (
  <div className="flex flex-col items-center">
    <div className="relative w-1 h-full bg-white">
      <div className="absolute top-0 px-2 py-1 text-xs text-white -translate-x-1/2 -translate-y-full rounded left-1/2">
        <div className="flex items-center justify-center w-12 h-12 border border-white rounded-full">
          <ChevronLeftIcon />
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  </div>
);

const ImageCompressorComparison = () => {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBeforeImage(URL.createObjectURL(file));

      new Compressor(file, {
        quality: 0.6,
        success: (compressedResult) => {
          setAfterImage(URL.createObjectURL(compressedResult));
          setCompressedBlob(compressedResult);
        },
        error: (err) => {
          console.error("Compression failed:", err.message);
        },
      });
    }
  };

  const handleDownload = () => {
    if (compressedBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(compressedBlob);
      link.download = "compressed_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-[90%]">
      <div className="my-8">
        <h2 className="mb-2 text-xl font-bold">Tải ảnh lên</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div
          onClick={handleImageClick}
          className="flex items-center justify-center w-full h-64 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
        >
          {beforeImage ? (
            <img
              src={beforeImage}
              alt="Selected"
              className="object-contain max-w-full max-h-full"
            />
          ) : (
            <div className="text-center">
              <Upload className="mx-auto mb-2" size={48} />
              <p className="text-gray-500">Click to upload an image</p>
            </div>
          )}
        </div>
      </div>

      {beforeImage && afterImage && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-bold">Nén hình ảnh</h2>
          <div className="items-center justify-between w-full">
            <div className="w-[50%] ">
              <ReactCompareImage
                leftImage={beforeImage}
                rightImage={afterImage}
                sliderPositionPercentage={0.5}
                handle={<CustomHandle />}
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-sm text-gray-600">
              * Trượt để so sánh hình ảnh gốc (trái) và hình ảnh nén (phải)
            </p>
            <button
              onClick={handleDownload}
              className="flex items-center h-10 p-2 mt-4 text-lg font-semibold bg-yellow-400 rounded-lg w-fit hover:bg-yellow-500"
            >
              <Download size={18} className="mr-2" />
              Download Compressed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressorComparison;
