"use client";
import React, { useState, useRef } from "react";
import Compressor from "compressorjs";
import { Download, Upload } from "lucide-react";
import JSZip from "jszip";

const ImageCompressorGallery = () => {
  const [compressedImages, setCompressedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      new Compressor(file, {
        quality: 0.8,
        success: (compressedResult) => {
          const newImage = {
            original: {
              url: URL.createObjectURL(file),
              size: file.size,
              name: file.name,
            },
            compressed: {
              url: URL.createObjectURL(compressedResult),
              size: compressedResult.size,
              blob: compressedResult,
            },
          };
          setCompressedImages((prevImages) => [...prevImages, newImage]);
        },
        error: (err) => {
          console.error("Compression failed:", err.message);
        },
      });
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    compressedImages.forEach((image, index) => {
      const fileName = `compressed_${
        image.original.name || `image_${index + 1}.jpg`
      }`;
      zip.file(fileName, image.compressed.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "compressed_images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const calculateReduction = (originalSize, compressedSize) => {
    const reduction = originalSize - compressedSize;
    const percentage = ((reduction / originalSize) * 100).toFixed(2);
    return {
      size: formatFileSize(reduction),
      percentage: percentage,
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="my-8">
        <h2 className="mb-2 text-xl font-bold">Tải ảnh lên</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          multiple
        />
        <div
          onClick={handleImageClick}
          className="flex items-center justify-center w-full h-64 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
        >
          <div className="text-center">
            <Upload className="mx-auto mb-2" size={48} />
            <p className="text-gray-500">Click to upload images</p>
            <p className="text-sm text-gray-400">
              (You can select multiple images)
            </p>
          </div>
        </div>
      </div>

      {compressedImages.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ảnh đã nén</h2>
            <button
              onClick={handleDownloadAll}
              className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              <Download size={18} className="mr-2" />
              Download All
            </button>
          </div>
          <div className="space-y-4">
            {compressedImages.map((image, index) => (
              <div
                key={index}
                className="flex items-center p-4 border rounded-lg shadow"
              >
                <img
                  src={image.compressed.url}
                  alt={`Compressed ${index + 1}`}
                  className="object-cover w-24 h-24 mr-4 rounded"
                />
                <div className="flex-grow">
                  <p className="font-semibold">
                    {image.original.name || `Image ${index + 1}`}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>Original: {formatFileSize(image.original.size)}</p>
                    <p>Compressed: {formatFileSize(image.compressed.size)}</p>
                    <p>
                      {
                        calculateReduction(
                          image.original.size,
                          image.compressed.size
                        ).percentage
                      }
                      % reduced
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownload(
                      image.compressed.blob,
                      `compressed_${
                        image.original.name || `image_${index + 1}.jpg`
                      }`
                    )
                  }
                  className="flex items-center justify-center h-10 px-4 py-2 ml-4 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <Download size={18} className="mr-2" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressorGallery;
