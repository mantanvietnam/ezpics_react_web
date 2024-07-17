import React from "react";
import Image from "next/image";
import imageIcon from "./save.png";
import exportIcon from "./Layer 2.png";

const Navbar = () => {
  return (
    <>
      <div
        style={{
          zIndex: "10",
          position: "fixed",
          width: "100vw"
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
              }}>
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
