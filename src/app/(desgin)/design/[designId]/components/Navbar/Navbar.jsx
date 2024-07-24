import React from "react";
import Image from "next/image";
import imageIcon from "./save.png";
import exportIcon from "./Layer 2.png";
import { useSelector } from "react-redux";
import { checkTokenCookie } from "@/utils";
import { saveListLayer } from "@/api/design";
import { toast } from "react-toastify";

const Navbar = () => {
  const stageData = useSelector((state) => state.stage.stageData);

  const handleSaveDesign = async () => {
    try {
      if (!stageData || !stageData.designLayers) {
        throw new Error("Invalid stageData or designLayers not found");
      }

      console.log(stageData.designLayers);

      const data = stageData.designLayers.map((layer) => ({
        id: layer.id,
        content: {
          ...layer.content,
          lat_anh: layer.content.scaleX === -1 ? 1 : 0, // Set lat_anh based on scaleX
          lat_anh_doc: layer.content.scaleY === -1 ? 1 : 0, // Set lat_anh_doc based on scaleY
        },
        sort: layer.sort,
      }));

      console.log(data);

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
                paddingTop: "20px",
                marginRight: "20px",
              }}>
              Nhập dữ liệu JSON
            </button>

            <button
              style={{
                paddingTop: "20px",
                marginRight: "20px",
              }}>
              Xuất dữ liệu JSON
            </button>

            <button
              style={{
                marginRight: "20px",
                paddingTop: "20px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleSaveDesign}>
              <Image
                src={imageIcon}
                alt=""
                style={{ width: 15, height: 15, marginRight: 10 }}
              />
              Lưu mẫu thiết kế
            </button>

            <button
              style={{
                marginRight: "4px",
                paddingTop: "20px",
                display: "flex",
                alignItems: "center",
              }}>
              <Image
                alt=""
                src={exportIcon}
                style={{ width: 15, height: 15, marginRight: 10 }}
              />
              Xuất ảnh
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
