import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import imageIcon from "./save.png";
import exportIcon from "./Layer 2.png";
import { useSelector } from "react-redux";
import { downloadListLayer, saveListLayer } from "@/api/design";
import { toast } from "react-toastify";
import { Button, Popover, Select, Slider, Tooltip } from "antd";
import { jsPDF } from "jspdf";
import { checkTokenCookie, getCookie } from "@/utils";
import Link from "next/link";
import Undo from "../../Icon/Undo";
import Redo from "../../Icon/Redo";
import { redo, undo } from "@/redux/slices/editor/stageSlice";
import { useDispatch } from "react-redux";

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

      const data = stageData.designLayers.map((layer) => ({
        id: layer.id,
        content: {
          ...layer.content,
        },
        sort: layer.sort,
      }));

      const jsonData = JSON.stringify(data);

      const response = await saveListLayer({
        idProduct: stageData.design?.id,
        token: checkTokenCookie(),
        listLayer: jsonData,
      });
      if (response.code == 1) {
        toast.success("Bạn đã lưu thiết kế thành công");
      } else {
        toast.error("Lưu thiết kế thất bại!");
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
            background: "#000",
            display: "flex",
            padding: "0 1.25rem",
            gridTemplateColumns: "240px 1fr 240px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: "1px solid #fff",
          }}>
          <Link href="/" className="flex flex-center">
            <NextImage
              alt=""
              src="/images/EZPICS.png"
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              gap: "0.5rem",
              alignItems: "center",
              paddingBottom: "10px",
              color: "#ffffff",
            }}>
            
            <div className="mx-2 pt-3 flex items-center justify-center cursor-pointer">
              <Tooltip placement="bottom" title="Undo">
                <Button onClick={handleUndo} size="small" type="text">
                  <Undo className="" />
                </Button>
              </Tooltip>
              <Tooltip placement="bottom" title="Redo">
                <Button onClick={handleRedo} size="small" type="text">
                  <Redo />
                </Button>
              </Tooltip>
            </div>
            <button
              style={{
                marginRight: "50px",
                paddingTop: "18px",
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
              onClick={handleSaveDesign}>
              <NextImage
                src={imageIcon}
                alt=""
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
              <p>Lưu mẫu thiết kế</p>
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
                  paddingTop: "18px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
                onClick={handleDownLoadDesign}>
                <NextImage
                  alt=""
                  src={exportIcon}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <p>Xuất ảnh</p>
              </button>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
