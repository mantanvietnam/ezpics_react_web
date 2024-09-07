import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { useSelector } from "react-redux";
import { saveListLayer } from "@/api/design";
import { toast } from "react-toastify";
import { checkTokenCookie } from "@/utils";
import Link from "next/link";
import SaveIcon from "@/app/(desgin)/design/[designId]/Icon/SaveIcon";
import ExportIcon from "@/app/(desgin)/design/[designId]/Icon/ExportIcon";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateDesign } from "@/api/design";
import "./navbar.css";
import { useRouter } from "next/navigation";

const Navbar = ({ invitationId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stageData = useSelector((state) => state.print.stageData);

  const handleSaveDesign = async () => {
    try {
      if (!stageData || !stageData.designLayers) {
        throw new Error("Invalid stageData or designLayers not found");
      }

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

  useEffect(() => {
    // Đăng ký sự kiện trước khi rời khỏi trang
    const handleBeforeUnload = (event) => {
      event.returnValue = "Bạn có chắc chắn muốn rời khỏi trang này?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
              onClick={handleSaveDesign}>
              <SaveIcon size={22} />
              <p className="pl-2">Lưu mẫu thiệp mời</p>
            </button>

            <button
              style={{
                marginRight: "50px",
                display: "flex",
                alignItems: "flex-start",
                fontSize: "18px",
              }}
              onClick={() => {
                handleSaveDesign();
                router.push(`/printed/${invitationId}`);
              }}>
              <ExportIcon size={22} />
              <p className="pl-2">Xuất link in thiệp</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
