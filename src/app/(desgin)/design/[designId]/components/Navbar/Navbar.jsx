import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { useSelector } from "react-redux";
import { saveListLayer } from "@/api/design";
import { toast } from "react-toastify";
import { Button, Popover, Select, Slider, Tooltip } from "antd";
import { jsPDF } from "jspdf";
import { checkTokenCookie } from "@/utils";
import Link from "next/link";
import SaveIcon from "../../Icon/SaveIcon";
import ExportIcon from "../../Icon/ExportIcon";
import Undo from "../../Icon/Undo";
import Redo from "../../Icon/Redo";
import { redo, undo } from "@/redux/slices/editor/stageSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateDesign } from "@/api/design";
import "./navbar.css";

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
        className="mt-4 text-lg font-bold h-14 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
        onClick={handleDownload}>
        Tải xuống
      </button>
    </div>
  </div>
);

const Navbar = ({ stageRef, setTransformerVisible }) => {
  const dispatch = useDispatch();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [fileType, setFileType] = useState("png");
  const [pixelRatio, setPixelRatio] = useState(1);
  const stageData = useSelector((state) => state.stage.stageData);
  const [isProMember, setIsProMember] = useState(true);

  const downloadURI = (url, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownLoadDesign = () => {
    setTransformerVisible(false); // Ẩn Transformer trước khi hiển thị modal
    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL({ pixelRatio }); // Tăng pixelRatio để tăng chất lượng
      setImageURL(dataURL); // Thiết lập URL cho modal
      setIsPopoverOpen(!isPopoverOpen); // Hiển thị modal
      setTransformerVisible(true); // Đảm bảo Transformer được hiển thị lại sau modal
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

  const handleSaveDesign = async () => {
    try {
      if (!stageData || !stageData.designLayers) {
        throw new Error("Invalid stageData or designLayers not found");
      }

      toast.info("Đang thực hiện lưu thiết kế", {
        autoClose: 2500,
      });

      const updatedLayers = await Promise.all(
        stageData.designLayers.map(async (layer) => {
          if (
            layer.content.banner &&
            layer.content.banner.startsWith("data:image/png;base64")
          ) {
            const bannerBlob = dataURLToBlob(layer.content.banner);
            const token = checkTokenCookie();
            const formData = new FormData();

            formData.append("idproduct", stageData.design.id);
            formData.append("token", token);
            formData.append("idlayer", layer.id);
            formData.append("file", bannerBlob);

            const headers = {
              "Content-Type": "multipart/form-data",
            };

            const config = {
              headers: headers,
            };

            const response = await axios.post(
              "https://apis.ezpics.vn/apis/changeLayerImageNew",
              formData,
              config
            );

            if (response && response?.data?.code === 1) {
              return {
                id: layer.id,
                content: {
                  ...layer.content,
                  banner: response.data?.link, // Cập nhật banner thành Blob
                },
                sort: layer.sort,
              };
            }
          }
          return {
            id: layer.id,
            content: {
              ...layer.content,
            },
            sort: layer.sort,
          };
        })
      );

      const jsonData = JSON.stringify(updatedLayers);

      const response = await saveListLayer({
        idProduct: stageData.design?.id,
        token: checkTokenCookie(),
        listLayer: jsonData,
      });
      if (response.code == 1) {
        toast.success("Bạn đã lưu thiết kế thành công", {
          autoClose: 500,
        });
      } else {
        toast.error("Lưu thiết kế thất bại!", {
          autoClose: 500,
        });
      }
    } catch (error) {
      console.error("Error saving design:", error);
    }
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  //them sua ten mau thiet ke
  const [nameDesign, setNameDesign] = useState(stageData.design.name || "");

  const handleSaveNameDesign = async () => {
    try {
      const res = await updateDesign({
        token: checkTokenCookie(),
        idProduct: stageData.design.id,
        name: nameDesign,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          zIndex: "10",
          position: "fixed",
          width: "100vw",
        }}>
        <div
          style={{
            height: "64px",
            background:
              "linear-gradient(90deg, rgba(160,112,34,1) 42%, rgba(223,180,54,0.8632703081232493) 60%)",
            display: "flex",
            padding: "0 1.25rem",
            gridTemplateColumns: "240px 1fr 240px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: "1px solid #fff",
          }}>
          <div className="flex">
            <Link href="/" className="flex flex-center">
              <NextImage
                alt=""
                src="/images/EZPICS.png"
                width={40}
                height={40}
                style={{ cursor: "pointer" }}
              />
            </Link>
            <input
              type="text"
              placeholder={stageData.design.name}
              value={nameDesign || ""} // Hiển thị giá trị hiện tại hoặc nameDesign nếu đã được thay đổi
              onChange={(e) => {
                setNameDesign(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveNameDesign();
                  e.target.blur();
                }
              }}
              onBlur={() => {
                handleSaveNameDesign();
              }}
              onFocus={() => {
                setNameDesign(nameDesign || stageData.design.name); // Đặt giá trị của nameDesign khi input được focus
              }}
              className="custom-input text-white bg-transparent rounded-lg p-1 w-full hover:ring-1 hover:ring-zinc-100 focus:ring-1 focus:ring-zinc-100 focus:outline-none ml-10"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              gap: "0.5rem",
              alignItems: "center",
              color: "#ffffff",
              height: "100%",
            }}>
            <button
              style={{
                marginRight: "50px",
                display: "flex",
                alignItems: "flex-start",
                fontSize: "18px",
              }}
              onClick={handleUndo}>
              <Undo />
              <p className="pl-2">Hoàn tác</p>
            </button>

            <button
              style={{
                marginRight: "50px",
                display: "flex",
                alignItems: "flex-start",
                fontSize: "18px",
              }}
              onClick={handleRedo}>
              <Redo />
              <p className="pl-2">Làm lại</p>
            </button>

            <button
              style={{
                marginRight: "50px",
                display: "flex",
                alignItems: "flex-start",
                fontSize: "18px",
              }}
              onClick={handleSaveDesign}>
              <SaveIcon size={22} />
              <p className="pl-2">Lưu mẫu thiết kế</p>
            </button>

            <Popover
              placement="bottomRight"
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
                style={{
                  marginRight: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: "18px",
                }}
                onClick={handleDownLoadDesign}>
                <ExportIcon size={23} />
                <p className="pl-1">Xuất ảnh</p>
              </button>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
