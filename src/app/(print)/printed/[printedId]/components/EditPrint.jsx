import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Popover, Select, Slider } from "antd";
import {
  updateLayer,
  moveLayerToFront,
  selectLayer,
  moveLayerToFinal,
} from "@/redux/slices/print/printSlice";
import ArrowTopIcon from "../icon/ArrowTop";
import ArrowBottomIcon from "../icon/ArrowBottom";
import ArrowLeftIcon from "../icon/ArrowLeft";
import ArrowRightIcon from "../icon/ArrowRight";
import jsPDF from "jspdf";
import PrintedIcon from "../icon/PrintedIcon";
import CancelIcon from "../icon/CancelIcon";
import ZoomInIcon from "../icon/ZoomIn";
import ZoomOutIcon from "../icon/ZoomOut";
import { useRouter } from "next/navigation";
import { saveImageToDB } from "./indexedDB";

const EditPrint = ({ stageRef, printedId }) => {
  const router = useRouter();
  const stageData = useSelector((state) => state.print.stageData);
  const dispatch = useDispatch();
  const { design, designLayers } = stageData;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [fileType, setFileType] = useState("png");
  const [isProMember, setIsProMember] = useState(true);

  const [selectedImageLayerId, setSelectedImageLayerId] = useState(null);

  const handleImageLayerClick = useCallback((layerId) => {
    setSelectedImageLayerId(layerId);
  }, []);

  console.log("selectedImageLayerId:", selectedImageLayerId);

  const [exportValue, setExportValue] = useState({
    valueText: "",
  });

  const [imgSrcs, setImgSrcs] = useState({});
  const fileInputRef = useRef(null);

  const downloadURI = (url, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error("Invalid data URL");
    }

    const mime = mimeMatch[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  const handleCancel = () => {
    setExportValue({ valueText: "" });
    setImgSrcs({});
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    filteredLayers.forEach((layer) => {
      if (layer.content.type === "image") {
        const data = {
          ...layer.content,
          banner:
            "https://apis.ezpics.vn/plugins/ezpics_api/view/image/default-thumbnail-vuong.jpg",
        };
        console.log("layer image", layer.id, data);
        dispatch(
          updateLayer({
            id: layer.id,
            data: data,
          })
        );
      } else if (layer.content.type === "text") {
        const data = {
          ...layer.content,
          text: `%${layer.content.variable}%`,
        };
        // console.log("layer text", layer.id, data);
        dispatch(
          updateLayer({
            id: layer.id,
            data: data,
          })
        );
      }
    });
  };

  // Lọc các layer có biến 'variable' không phải là chuỗi rỗng
  const filteredLayers = designLayers.filter(
    (layer) => layer.content.variable && layer.content.variable.trim() !== ""
  );

  function onSelectFile(e, layerId) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const newImgSrc = reader.result?.toString() || "";

        const img = new Image();
        img.src = newImgSrc;
        img.onload = () => {
          const layer = filteredLayers.find((layer) => layer.id === layerId);

          if (layer && layer.content.type === "image") {
            const data = {
              ...layer.content,
              banner: newImgSrc,
              naturalWidth: img.width,
              naturalHeight: img.height,
            };
            dispatch(updateLayer({ id: layer.id, data }));

            // Cập nhật imgSrc mới cho biến ảnh được chọn
            setImgSrcs((prevImgSrcs) => ({
              ...prevImgSrcs,
              [layerId]: newImgSrc,
            }));
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }

  const handleTextChange = (e) => {
    const newTextValue = e.target.value;
    setExportValue({ ...exportValue, valueText: newTextValue });

    filteredLayers.forEach((layer) => {
      if (layer.content.type === "text") {
        const data = {
          ...layer.content,
          text: newTextValue,
        };
        dispatch(
          updateLayer({
            id: layer.id,
            data: data,
          })
        );
      }
    });
  };

  const moveLayer = (layerId, direction) => {
    filteredLayers.forEach((layer) => {
      if (layer.id === layerId) {
        const newContent = { ...layer.content };
        const moveAmount = 0.5; // Kích thước di chuyển, bạn có thể điều chỉnh giá trị này

        // Cập nhật vị trí dựa trên hướng
        switch (direction) {
          case "left":
            newContent.postion_left -= moveAmount;
            break;
          case "right":
            newContent.postion_left += moveAmount;
            break;
          case "up":
            newContent.postion_top -= moveAmount;
            break;
          case "down":
            newContent.postion_top += moveAmount;
            break;
          default:
            break;
        }

        dispatch(
          updateLayer({
            id: layerId,
            data: newContent,
          })
        );
      }
    });
  };

  const zoomLayer = (layerId, direction) => {
    filteredLayers.forEach((layer) => {
      if (layer.id === layerId) {
        const newContent = { ...layer.content };
        const zoomFactor = 0.1;
        switch (direction) {
          case "zoomin":
            newContent.scaleX = (newContent.scaleX || 1) + zoomFactor;
            newContent.scaleY = (newContent.scaleY || 1) + zoomFactor;
            break;
          case "zoomout":
            newContent.scaleX = (newContent.scaleX || 1) - zoomFactor;
            newContent.scaleY = (newContent.scaleY || 1) - zoomFactor;
            break;
          default:
            break;
        }

        newContent.scaleX = Math.max(newContent.scaleX, 0.1);
        newContent.scaleY = Math.max(newContent.scaleY, 0.1);

        dispatch(
          updateLayer({
            id: layerId,
            data: newContent,
          })
        );
      }
    });
  };

  const buttonEditRef = useRef(null);
  const [layerId, setLayerId] = useState(null);

  const handleEditAvatar = (layerId) => {
    setLayerId(layerId);
    dispatch(moveLayerToFront({ id: layerId }));
    dispatch(selectLayer({ id: layerId }));
  };

  const handleSaveAvatar = () => {
    dispatch(moveLayerToFinal({ id: layerId }));
  };

  // Hàm để chuyển hướng và lưu ảnh
  const handleNavigateDownload = async () => {
    const originalWidth = stageData.design.width;
    const originalHeight = stageData.design.height;

    const currentWidth = stageRef.current.width();
    const currentHeight = stageRef.current.height();

    const pixelRatioWidth = originalWidth / currentWidth;
    const pixelRatioHeight = originalHeight / currentHeight;
    const pixelRatio = Math.max(pixelRatioWidth, pixelRatioHeight);

    const dataURL = stageRef.current.toDataURL({ pixelRatio }); // Tăng pixelRatio để tăng chất lượng
    // Lưu imageURL vào IndexedDB
    await saveImageToDB("my-image-id", dataURL);
    // Chuyển hướng đến trang tải ảnh
    router.push(`/printed/${printedId}/download`);
  };

  return (
    <div className="mb-[100px] pb-[100px] mobile:pb-0">
      {filteredLayers.map((layer) => {
        if (layer.content?.type === "image") {
          const imgSrc = imgSrcs[layer.id] || "";
          return (
            <div className="w-[300px] md:w-[400px] h-full" key={layer.id}>
              <h4 className="py-2 text-lg font-bold text-white">
                {layer.content.variableLabel}
              </h4>
              <div onClick={() => handleImageLayerClick(layer.id)}>
                {imgSrc ? (
                  <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div
                      ref={buttonEditRef}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "24px",
                        position: "relative",
                        backgroundColor: "#f0f0f0", // Màu nền xám
                        overflow: "hidden", // Ẩn phần ảnh bị tràn
                        width: "30%",
                        height: "auto", // Chiều cao tự động dựa trên kích thước ảnh
                      }}
                      className="hover:shadow-lg hover:shadow-yellow-500/50"
                      onClick={() => handleEditAvatar(layer.id)}
                    >
                      <img
                        src={imgSrc}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain", // Đảm bảo ảnh không bị méo
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between w-full p-2 my-2 bg-gray-100 rounded-lg">
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "left")}
                      >
                        <ArrowLeftIcon size={25} />
                      </div>
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "up")}
                      >
                        <ArrowTopIcon size={25} />
                      </div>
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "right")}
                      >
                        <ArrowRightIcon size={25} />
                      </div>
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "down")}
                      >
                        <ArrowBottomIcon size={25} />
                      </div>
                    </div>
                    <div className="w-[100%] mobile:w-[90%] lg:w-[70%] flex justify-around items-center mb-2">
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-lg shadow-lg cursor-pointer"
                        onClick={() => zoomLayer(layer.id, "zoomin")}
                      >
                        <ZoomInIcon size={25} />
                        <p className="pl-2">Phóng to</p>
                      </div>
                      <div
                        className="flex items-center justify-center p-2 bg-white rounded-lg shadow-lg cursor-pointer"
                        onClick={() => zoomLayer(layer.id, "zoomout")}
                      >
                        <ZoomOutIcon size={25} />
                        <p className="pl-2">Thu nhỏ</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col mobile:pt-4">
                    <form
                      id="file-upload-form"
                      className="block clear-both w-full mx-auto max-w-600"
                    >
                      <input
                        className="hidden"
                        id="file-upload"
                        type="file"
                        name="fileUpload"
                        accept="image/*"
                        onChange={(e) => onSelectFile(e, layer.id)}
                      />

                      <label
                        className="float-left clear-both w-full px-6 py-8 text-center transition-all bg-white border rounded-lg select-none"
                        htmlFor="file-upload"
                        id="file-drag"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          id="file-image"
                          src="#"
                          alt="Preview"
                          className="hidden"
                        />
                        <div id="">
                          <img
                            src="/images/direct-download.png"
                            alt=""
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              margin: "0 auto",
                              marginBottom: "2%",
                            }}
                          />
                          <div id="notimage" className="hidden">
                            Hãy chọn ảnh
                          </div>
                          <span id="file-upload-btn" className="">
                            {imgSrc === "" && "Chọn ảnh"}
                          </span>
                        </div>
                      </label>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        } else if (layer.content?.type === "text") {
          return (
            <div key={layer.id}>
              <h4 className="py-2 text-lg font-bold text-white">
                {layer.content.variableLabel}
              </h4>
              <Input
                value={exportValue.valueText}
                onChange={handleTextChange}
              />
              {exportValue.valueText !== "" && (
                <div className="flex items-center justify-between p-2 my-2 bg-gray-100 rounded-lg shadow-md">
                  <div
                    className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "left")}
                  >
                    <ArrowLeftIcon size={25} />
                  </div>
                  <div
                    className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "up")}
                  >
                    <ArrowTopIcon size={25} />
                  </div>
                  <div
                    className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "right")}
                  >
                    <ArrowRightIcon size={25} />
                  </div>
                  <div
                    className="flex items-center justify-center p-2 bg-white rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "down")}
                  >
                    <ArrowBottomIcon size={25} />
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
      <div className="flex pb-[100px] mobile:pb-0">
        <button
          className="flex items-center h-10 p-2 mt-4 mr-2 text-lg font-bold bg-yellow-400 rounded-lg hover:bg-yellow-500"
          onClick={handleNavigateDownload}
        >
          <PrintedIcon size={25} />
          <p className="pl-2">Tải ảnh</p>
        </button>

        <button
          className="flex items-center h-10 p-2 mx-2 mt-4 text-lg font-bold bg-yellow-400 rounded-lg hover:bg-yellow-500"
          onClick={handleCancel}
        >
          <CancelIcon size={25} />
          <p className="pl-2">Nhập lại</p>
        </button>
      </div>
    </div>
  );
};

export default EditPrint;
