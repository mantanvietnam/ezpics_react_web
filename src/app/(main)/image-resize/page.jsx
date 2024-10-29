"use client";
import React, { useState, useRef } from "react";

const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resizedImageUrl, setResizedImageUrl] = useState("");
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [resizeMode, setResizeMode] = useState("custom");
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState("");
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const getFileExtension = (type) => {
    switch (type) {
      case "image/png":
        return "png";
      case "image/jpeg":
      case "image/jpg":
        return "jpg";
      default:
        return "jpg"; // default fallback
    }
  };

  const getMimeType = (type) => {
    switch (type) {
      case "image/png":
        return "image/png";
      case "image/jpeg":
      case "image/jpg":
        return "image/jpeg";
      default:
        return "image/jpeg"; // default fallback
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setFileType(file.type);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedImageUrl("");

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height,
        });
        setCustomWidth(img.width.toString());
        setCustomHeight(img.height.toString());
      };
      img.src = url;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setCustomWidth(newWidth);

    if (resizeMode === "ratio" && originalDimensions.width && newWidth) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setCustomHeight(Math.round(newWidth * ratio).toString());
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setCustomHeight(newHeight);

    if (resizeMode === "ratio" && originalDimensions.height && newHeight) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setCustomWidth(Math.round(newHeight * ratio).toString());
    }
  };

  const resizeImage = () => {
    if (!selectedFile || !customWidth || !customHeight) return;

    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      // Nếu là PNG, giữ trong suốt, nếu không thì vẽ background trắng
      if (fileType !== "image/png") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      const resizedUrl = canvas.toDataURL(getMimeType(fileType), 1.0);
      setResizedImageUrl(resizedUrl);
    };

    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!resizedImageUrl || !selectedFile) return;

    // Lấy tên file gốc và thêm hậu tố -resized
    const originalFileName = selectedFile.name;
    const fileNameWithoutExt = originalFileName.substring(
      0,
      originalFileName.lastIndexOf(".")
    );
    const extension = getFileExtension(fileType);
    const newFileName = `${fileNameWithoutExt}-resized.${extension}`;

    const link = document.createElement("a");
    link.href = resizedImageUrl;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ... phần return UI giữ nguyên như cũ ...
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="max-w-5xl mx-auto overflow-hidden bg-white shadow-lg rounded-xl">
        <div className="p-6 bg-gradient-to-r from-red-600 to-yellow-500">
          <h1 className="text-3xl font-bold text-center text-white">
            Image Resizer Tool
          </h1>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${
                isDragging
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-200 hover:border-red-400"
              }
              ${!selectedFile ? "mb-8" : "mb-4"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-lg text-gray-600">
                Kéo thả ảnh vào đây hoặc{" "}
                <span className="font-medium text-red-500">chọn file</span>
              </div>
              <p className="text-sm text-gray-400">PNG, JPG, JPEG (Max 10MB)</p>
            </div>
          </div>

          {/* Resize Controls */}
          {selectedFile && (
            <div className="p-6 mb-6 bg-red-50 rounded-xl">
              <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
                <div className="flex gap-4">
                  <label className="flex items-center transition-colors cursor-pointer hover:text-red-600">
                    <input
                      type="radio"
                      checked={resizeMode === "custom"}
                      onChange={() => setResizeMode("custom")}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2">Tùy chỉnh tự do</span>
                  </label>
                  <label className="flex items-center transition-colors cursor-pointer hover:text-red-600">
                    <input
                      type="radio"
                      checked={resizeMode === "ratio"}
                      onChange={() => setResizeMode("ratio")}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2">Giữ tỷ lệ</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={handleWidthChange}
                      min="1"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={handleHeightChange}
                      min="1"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resizeImage}
                    disabled={!selectedFile || !customWidth || !customHeight}
                    className="px-6 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    Resize
                  </button>
                  <button
                    onClick={downloadImage}
                    disabled={!resizedImageUrl}
                    className="px-6 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    Tải về
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview Section */}
          {selectedFile && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className="p-4 bg-gradient-to-r from-red-100 to-yellow-100">
                  <h3 className="font-medium text-gray-800">Ảnh gốc</h3>
                </div>
                <div className="relative p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded"
                    ref={imageRef}
                  />
                  <div className="absolute px-3 py-1 text-sm text-white bg-black bg-opacity-75 rounded-full top-6 left-6">
                    {originalDimensions.width} x {originalDimensions.height}
                  </div>
                </div>
              </div>

              {resizedImageUrl && (
                <div className="overflow-hidden bg-white shadow-md rounded-xl">
                  <div className="p-4 bg-gradient-to-r from-red-100 to-yellow-100">
                    <h3 className="font-medium text-gray-800">Ảnh đã resize</h3>
                  </div>
                  <div className="relative p-4">
                    <img
                      src={resizedImageUrl}
                      alt="Resized"
                      className="w-full h-auto rounded"
                    />
                    <div className="absolute px-3 py-1 text-sm text-white bg-black bg-opacity-75 rounded-full top-6 left-6">
                      {customWidth} x {customHeight}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!selectedFile && (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                Chưa có ảnh nào được chọn. Hãy tải ảnh lên để bắt đầu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
