import React, { useState, useRef, useEffect } from "react";
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

const DownLoadMenu = ({
  handleDownload,
  fileType,
  setFileType,
  isProMember,
}) => (
  <div className="w-[300px] mobile:w-[400px] md:w-[500px] h-fit p-3">
    <div className="mt-4 flex flex-col">
      <label htmlFor="fileType" className="mb-2 text-lg">
        Chọn loại tệp:
      </label>
      <Select
        id="fileType"
        value={fileType}
        onChange={(value) => setFileType(value)}
        style={{ width: "100%", height: 50 }}
      >
        <Select.Option value="png">
          <div className="flex items-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 8.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7Zm4-2.5h10A2.5 2.5 0 0 1 19.5 7v4.23l-.853-.854c-.485-.485-.892-.892-1.257-1.184-.384-.307-.79-.546-1.287-.616a2.625 2.625 0 0 0-.74 0c-.497.07-.903.309-1.287.616-.365.292-.772.7-1.257 1.184l-7.943 7.943A2.488 2.488 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Zm-.983 14.8c.302.128.634.2.983.2h10a2.5 2.5 0 0 0 2.5-2.5v-3.65l-1.884-1.884c-.522-.522-.871-.869-1.163-1.103-.281-.224-.439-.285-.562-.302a1.122 1.122 0 0 0-.317 0c-.122.017-.28.078-.561.302-.292.234-.64.581-1.163 1.103L6.017 19.3Z"
                fill="currentColor"
              ></path>
            </svg>
            <p className="text-xl pl-3">PNG</p>
          </div>
        </Select.Option>
        <Select.Option value="pdf">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M6.5 4a.5.5 0 0 1 .5-.5h4.002v4.503a2 2 0 0 0 2 2h5.248a.75.75 0 0 0 .75-.75V9.25a.747.747 0 0 0-.22-.531l-6.134-6.134A2.002 2.002 0 0 0 11.231 2h-4.23A2 2 0 0 0 5 4v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7.75a.75.75 0 0 0-1.5 0V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4Zm9.942 4.503-3.94-3.94v3.44a.5.5 0 0 0 .5.5h3.44ZM9 17a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 17Zm.75-4.754a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-xl pl-3">PDF</p>
          </div>
        </Select.Option>
      </Select>
      {/* {fileType === "png" && (
        <div className="mt-4">
          <label htmlFor="pixelRatio" className="mb-2 text-lg">
            Chọn kích cỡ x
          </label>
          <div className="flex items-center justify-between">
            <Slider
              id="pixelRatio"
              min={1}
              max={5}
              value={pixelRatio || 1}
              onChange={(value) => {
                if (isProMember) {
                  setPixelRatio(value);
                } else {
                  toast.warning(
                    "Bạn cần là thành viên Pro để thay đổi kích cỡ."
                  );
                }
              }}
              step={1}
              style={{ width: 400 }}
              // disabled={!isProMember}
            />
            <p className="text-base font-bold border border-slate-300 rounded ml-3 py-2 px-3">
              {pixelRatio}
            </p>
          </div>
        </div>
      )} */}
      <button
        className="mt-4 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
        onClick={handleDownload}
      >
        Tải xuống
      </button>
    </div>
  </div>
);

const EditPrint = ({ stageRef }) => {
  const stageData = useSelector((state) => state.print.stageData);
  const dispatch = useDispatch();
  const { design, designLayers } = stageData;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [fileType, setFileType] = useState("png");
  const [isProMember, setIsProMember] = useState(true);

  const [exportValue, setExportValue] = useState({
    valueText: "",
  });

  const [imgSrc, setImgSrc] = useState("");
  const fileInputRef = useRef(null);

  const downloadURI = (url, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownLoadDesign = () => {
    const originalWidth = stageData.design.width;
    const originalHeight = stageData.design.height;

    const currentWidth = stageRef.current.width();
    const currentHeight = stageRef.current.height();

    const pixelRatioWidth = originalWidth / currentWidth;
    const pixelRatioHeight = originalHeight / currentHeight;
    const pixelRatio = Math.max(pixelRatioWidth, pixelRatioHeight);

    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL({ pixelRatio }); // Tăng pixelRatio để tăng chất lượng
      setImageURL(dataURL); // Thiết lập URL cho modal
      setIsPopoverOpen(!isPopoverOpen); // Hiển thị modal
    }, 100); // Độ trễ để đảm bảo Transformer đã bị ẩn
  };

  const handleDownload = () => {
    if (fileType === "png") {
      handleDownloadPNG();
    } else if (fileType === "pdf") {
      handleDownloadPDF();
    }
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

  const handleDownloadPNG = () => {
    if (imageURL) {
      const originalWidth = stageData.design.width;
      const originalHeight = stageData.design.height;

      const currentWidth = stageRef.current.width();
      const currentHeight = stageRef.current.height();

      const pixelRatioWidth = originalWidth / currentWidth;
      const pixelRatioHeight = originalHeight / currentHeight;
      const pixelRatio = Math.max(pixelRatioWidth, pixelRatioHeight);

      const dataURL = stageRef.current.toDataURL({ pixelRatio }); // Sử dụng pixelRatio từ thanh trượt
      downloadURI(dataURL, "download.png");
      // Mở cửa sổ mới với ảnh

      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        const blob = dataURLToBlob(imageURL);
        const newImgURL = URL.createObjectURL(blob);
        window.open(newImgURL, "_blank");
        URL.revokeObjectURL(newImgURL); // Giải phóng tài nguyên URL Blob
      };

      setIsPopoverOpen(false); // Đóng modal sau khi tải về
    }
  };

  const handleDownloadPDF = () => {
    if (imageURL) {
      const img = new Image();
      img.src = imageURL;
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Tạo một trang PDF với kích thước khớp với ảnh
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight],
        });

        pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("download.pdf");
        setIsPopoverOpen(false);
      };
    }
  };

  const handleCancel = () => {
    setExportValue({ valueText: "" });
    setImgSrc("");
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

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const newImgSrc = reader.result?.toString() || "";
        setImgSrc(newImgSrc);

        const img = new Image();
        img.src = newImgSrc;
        img.onload = () => {
          filteredLayers.forEach((layer) => {
            if (layer.content.type === "image") {
              const data = {
                ...layer.content,
                banner: newImgSrc,
                naturalWidth: img.width,
                naturalHeight: img.height,
                // width: "auto", // Bỏ kích thước cũ để giữ tỷ lệ
                // height: "auto", // Bỏ kích thước cũ để giữ tỷ lệ
              };
              dispatch(updateLayer({ id: layer.id, data }));
            }
          });
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

  // Xử lý khi nhấn nút "In ảnh"
  const exportButtonClick = () => {
    filteredLayers.forEach((layer) => {
      if (layer.content.type === "image" && imgSrc) {
        const data = {
          ...layer.content,
          banner: imgSrc,
        };
        dispatch(
          updateLayer({
            id: layer.id,
            data: data,
          })
        );
      } else if (layer.content.type === "text" && exportValue.valueText) {
        const data = {
          ...layer.content,
          text: exportValue.valueText,
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

  // Effect to handle 'blur' and 'Enter' events
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside the button, call handleSaveAvatar
      if (
        buttonEditRef.current &&
        !buttonEditRef.current.contains(event.target)
      ) {
        console.log("save");
        handleSaveAvatar(); // Using handleSaveAvatar function for clarity
      }
    };

    // Add event listeners for clicks outside and key presses
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonEditRef, handleSaveAvatar, layerId, dispatch]);

  return (
    <div>
      {filteredLayers.map((layer) => {
        if (layer.content?.type === "image") {
          return (
            <div className="w-[300px] md:w-[400px] h-fit" key={layer.id}>
              <h4 className="text-lg font-bold py-2 text-white">
                {layer.content.variableLabel}
              </h4>
              <div>
                {imgSrc ? (
                  <div className="flex flex-col justify-center items-center bg-gray-100">
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
                    <div className="w-full flex justify-between items-center bg-gray-100 p-2 my-2 rounded-lg">
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "left")}
                      >
                        <ArrowLeftIcon size={25} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "up")}
                      >
                        <ArrowTopIcon size={25} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "right")}
                      >
                        <ArrowRightIcon size={25} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                        onClick={() => moveLayer(layer.id, "down")}
                      >
                        <ArrowBottomIcon size={25} />
                      </div>
                    </div>
                    <div className="w-[100%] mobile:w-[90%] lg:w-[70%] flex justify-around items-center mb-2">
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-lg shadow-lg cursor-pointer"
                        onClick={() => zoomLayer(layer.id, "zoomin")}
                      >
                        <ZoomInIcon size={25} />
                        <p className="pl-2">Phóng to</p>
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-lg shadow-lg cursor-pointer"
                        onClick={() => zoomLayer(layer.id, "zoomout")}
                      >
                        <ZoomOutIcon size={25} />
                        <p className="pl-2">Thu nhỏ</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col relative mobile:pt-4">
                    <form
                      id="file-upload-form"
                      className="block clear-both mx-auto w-full max-w-600"
                    >
                      <input
                        className="hidden"
                        id="file-upload"
                        type="file"
                        name="fileUpload"
                        accept="image/*"
                        onChange={onSelectFile}
                      />

                      <label
                        className="float-left clear-both w-full py-8 px-6 text-center bg-white rounded-lg border transition-all select-none"
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
              <h4 className="text-lg font-bold py-2 text-white">
                {layer.content.variableLabel}
              </h4>
              <Input
                value={exportValue.valueText}
                onChange={handleTextChange}
              />
              {exportValue.valueText !== "" && (
                <div className="flex justify-between items-center bg-gray-100 p-2 my-2 rounded-lg shadow-md">
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "left")}
                  >
                    <ArrowLeftIcon size={25} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "up")}
                  >
                    <ArrowTopIcon size={25} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
                    onClick={() => moveLayer(layer.id, "right")}
                  >
                    <ArrowRightIcon size={25} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg cursor-pointer"
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
      <div className="flex">
        <Popover
          placement="top"
          trigger="click"
          autoFocus
          returnFocus
          content={
            <DownLoadMenu
              handleDownload={handleDownload}
              fileType={fileType}
              setFileType={setFileType}
              isProMember={isProMember}
            />
          }
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
        >
          <button
            className="flex items-center mt-4 mr-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
            onClick={handleDownLoadDesign}
          >
            <PrintedIcon size={25} />
            <p className="pl-2">Tải ảnh</p>
          </button>
        </Popover>
        <button
          className="flex items-center mt-4 mx-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
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
