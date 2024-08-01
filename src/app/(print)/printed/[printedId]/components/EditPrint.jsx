import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Popover, Select, Slider } from "antd";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import ArrowTopIcon from "../icon/ArrowTop";
import ArrowBottomIcon from "../icon/ArrowBottom";
import ArrowLeftIcon from "../icon/ArrowLeft";
import ArrowRightIcon from "../icon/ArrowRight";
import jsPDF from "jspdf";
import PrintedIcon from "../icon/PrintedIcon";
import CancelIcon from "../icon/CancelIcon";

const DownLoadMenu = ({
  handleDownload,
  fileType,
  setFileType,
  pixelRatio,
  setPixelRatio,
  isProMember,
}) => (
  <div className="w-[500px] h-fit p-3">
    <div className="mt-4 flex flex-col">
      <label htmlFor="fileType" className="mb-2 text-lg">
        Chọn loại tệp:
      </label>
      <Select
        id="fileType"
        value={fileType}
        onChange={(value) => setFileType(value)}
        style={{ width: "100%", height: 50 }}>
        <Select.Option value="png">
          <div className="flex items-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.5 8.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
                fill="currentColor"></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7Zm4-2.5h10A2.5 2.5 0 0 1 19.5 7v4.23l-.853-.854c-.485-.485-.892-.892-1.257-1.184-.384-.307-.79-.546-1.287-.616a2.625 2.625 0 0 0-.74 0c-.497.07-.903.309-1.287.616-.365.292-.772.7-1.257 1.184l-7.943 7.943A2.488 2.488 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Zm-.983 14.8c.302.128.634.2.983.2h10a2.5 2.5 0 0 0 2.5-2.5v-3.65l-1.884-1.884c-.522-.522-.871-.869-1.163-1.103-.281-.224-.439-.285-.562-.302a1.122 1.122 0 0 0-.317 0c-.122.017-.28.078-.561.302-.292.234-.64.581-1.163 1.103L6.017 19.3Z"
                fill="currentColor"></path>
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
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M6.5 4a.5.5 0 0 1 .5-.5h4.002v4.503a2 2 0 0 0 2 2h5.248a.75.75 0 0 0 .75-.75V9.25a.747.747 0 0 0-.22-.531l-6.134-6.134A2.002 2.002 0 0 0 11.231 2h-4.23A2 2 0 0 0 5 4v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7.75a.75.75 0 0 0-1.5 0V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4Zm9.942 4.503-3.94-3.94v3.44a.5.5 0 0 0 .5.5h3.44ZM9 17a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 17Zm.75-4.754a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                clipRule="evenodd"></path>
            </svg>
            <p className="text-xl pl-3">PDF</p>
          </div>
        </Select.Option>
      </Select>
      {fileType === "png" && (
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
      )}
      <button
        className="mt-4 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
        onClick={handleDownload}>
        Tải xuống
      </button>
    </div>
  </div>
);

const EditPrint = ({ stageRef }) => {
  const stageData = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();
  const { design, designLayers } = stageData;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [fileType, setFileType] = useState("png");
  const [pixelRatio, setPixelRatio] = useState(1);
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

  const handleDownloadPNG = () => {
    if (imageURL) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio }); // Sử dụng pixelRatio từ thanh trượt
      downloadURI(dataURL, "download.png");
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
          text: "%_text_%",
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

        filteredLayers.forEach((layer) => {
          if (layer.content.type === "image") {
            const data = {
              ...layer.content,
              banner: newImgSrc,
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
    console.log("In ảnh");
    filteredLayers.forEach((layer) => {
      if (layer.content.type === "image" && imgSrc) {
        const data = {
          ...layer.content,
          banner: imgSrc,
        };
        console.log("layer image", layer.id, data);
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

  return (
    <div>
      {filteredLayers.map((layer) => {
        if (layer.content?.type === "image") {
          return (
            <div className="w-[400px] h-fit" key={layer.id}>
              <h4 className="text-lg font-bold py-2 text-white">
                {layer.content.variableLabel}
              </h4>
              <div>
                {imgSrc ? (
                  <div className="flex flex-col justify-center items-center bg-gray-100">
                    <div
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
                      }}>
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
                    <div className="w-full flex justify-between items-center bg-gray-100 p-4 mt-2 rounded-lg shadow-md">
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                        onClick={() => moveLayer(layer.id, "left")}>
                        <ArrowLeftIcon size={30} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                        onClick={() => moveLayer(layer.id, "up")}>
                        <ArrowTopIcon size={30} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                        onClick={() => moveLayer(layer.id, "right")}>
                        <ArrowRightIcon size={30} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                        onClick={() => moveLayer(layer.id, "down")}>
                        <ArrowBottomIcon size={30} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col relative pt-4">
                    <form
                      id="file-upload-form"
                      className="block clear-both mx-auto w-full max-w-600">
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
                        style={{ cursor: "pointer" }}>
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
                <div className="flex justify-between items-center bg-gray-100 p-4 mt-2 rounded-lg shadow-md">
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                    onClick={() => moveLayer(layer.id, "left")}>
                    <ArrowLeftIcon size={30} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                    onClick={() => moveLayer(layer.id, "up")}>
                    <ArrowTopIcon size={30} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                    onClick={() => moveLayer(layer.id, "right")}>
                    <ArrowRightIcon size={30} />
                  </div>
                  <div
                    className="flex justify-center items-center bg-white p-2 rounded-full shadow-lg"
                    onClick={() => moveLayer(layer.id, "down")}>
                    <ArrowBottomIcon size={30} />
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
      <div className="flex">
        <Popover
          placement="left"
          trigger="click"
          autoFocus
          returnFocus
          content={
            <DownLoadMenu
              handleDownload={handleDownload}
              fileType={fileType}
              setFileType={setFileType}
              pixelRatio={pixelRatio}
              setPixelRatio={setPixelRatio}
              isProMember={isProMember}
            />
          }
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}>
          <button
            className="flex items-center mt-4 mr-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
            onClick={handleDownLoadDesign}>
            <PrintedIcon size={25} />
            <p className="pl-2">In ảnh</p>
          </button>
        </Popover>
        <button
          className="flex items-center mt-4 mx-2 p-2 text-lg font-bold h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
          onClick={handleCancel}>
          <CancelIcon size={25} />
          <p className="pl-2">Nhập lại</p>
        </button>
      </div>
    </div>
  );
};

export default EditPrint;
