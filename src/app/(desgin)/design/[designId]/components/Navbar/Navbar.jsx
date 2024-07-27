import React, { useState } from "react";
import Image from "next/image";
import imageIcon from "./save.png";
import exportIcon from "./Layer 2.png";
import { useSelector } from "react-redux";
import { checkTokenCookie } from "@/utils";
import { downloadListLayer, saveListLayer } from "@/api/design";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";

const Navbar = ({ stageRef, setTransformerVisible }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const stageData = useSelector((state) => state.stage.stageData);

  const downloadURI = (url, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownLoadDesign = () => {
    setTransformerVisible(false); // Hide Transformer before showing the modal
    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 1 });
      setImageURL(dataURL); // Set the URL for the modal
      setIsModalOpen(true); // Show the modal
      setTransformerVisible(true); // Ensure Transformer is shown again after modal
    }, 100); // Delay to ensure Transformer is hidden
  };

  const handleDownloadFromModal = () => {
    if (imageURL) {
      downloadURI(imageURL, "download.png");
      setIsModalOpen(false); // Close the modal after download
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
          <div>
            <Image
              alt=""
              src="/images/EZPICS.png"
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              gap: "0.5rem",
              alignItems: "center",
              paddingBottom: "10px",
              color: "#ffffff",
            }}>
            <button
              style={{
                marginRight: "50px",
                paddingTop: "18px",
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
              onClick={handleSaveDesign}>
              <Image
                src={imageIcon}
                alt=""
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
              <p>Lưu mẫu thiết kế</p>
            </button>

            <button
              style={{
                marginRight: "4px",
                paddingTop: "18px",
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
              onClick={handleDownLoadDesign}>
              <Image
                alt=""
                src={exportIcon}
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
              <p>Xuất ảnh</p>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for previewing and downloading image */}
      <Modal
        title="Preview Image"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="download"
            type="primary"
            onClick={handleDownloadFromModal}>
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
        ]}
        style={{ textAlign: "center" }}>
        <img src={imageURL} alt="Preview" style={{ maxWidth: "100%" }} />
      </Modal>
    </>
  );
};

export default Navbar;
