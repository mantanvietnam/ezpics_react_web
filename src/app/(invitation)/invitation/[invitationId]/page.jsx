"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import { getListLayerApi } from "@/api/design";
import { checkTokenCookie } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setStageData,
  updateLayer,
  addLayerImage,
  removeLayer,
  addLayerText,
} from "@/redux/slices/print/printSlice";
import { Stage, Layer } from "react-konva";
import images from "../../../../../public/images/index2";
import Link from "next/link";
import Image from "next/image";
import "@/styles/loading.css";
import useFonts from "../../../../hooks/useLoadFont";
import Navbar from "./component/Navbar/Navbar";
import BackgroundLayerInvitation from "./component/Editor/BackgroundLayerInvitation";
import ImageLayerInvitation from "./component/Editor/ImageLayerInvitation";
import TextLayerInvitation from "./component/Editor/TextLayerInvitation";
import EditInvitation from "./component/Editor/EditInvitation";

const Page = () => {
  const params = useParams();
  const { invitationId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.print.stageData);
  const { design, initSize, designLayers, selectedLayer } = stageData;
  const [loading, setLoading] = useState(true);
  const [sizeRespon, setSizeRespon] = useState(1); // Initial sizeRespon
  const { fonts, setFonts } = useFonts();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      const calculateSizeFactor = () => {
        if (windowWidth >= 1600) {
          return 0.5;
        } else if (windowWidth >= 1200) {
          return 1;
        } else if (windowWidth >= 950) {
          return 1.5;
        } else if (windowWidth >= 600) {
          return 1.5;
        } else {
          return 2.2;
        }
      };

      const newSizeRespon = calculateSizeFactor();
      setSizeRespon(newSizeRespon);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize); // Add event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up
    };
  }, []); // Empty dependency array ensures this runs only once

  const fetchData = async () => {
    try {
      const response = await getListLayerApi({
        idproduct: invitationId,
        token: checkTokenCookie(),
      });
      if (response.code === 1) {
        const { width, height } = response.data;
        let sizeFactor;

        // console.log("width, heigh", width, height);

        // Determine sizeFactor based on dimensions
        sizeFactor =
          width >= 4000 || height >= 4000
            ? 7
            : width >= 3000 || height >= 3000
            ? 5
            : width >= 2500 || height >= 2500
            ? 3.7
            : width >= 1920 || height >= 1920
            ? 3
            : width >= 1600 || height >= 1600
            ? 2
            : width >= 1000 || height >= 1000
            ? 1.5
            : 1;

        dispatch(
          setStageData({
            initSize: {
              width: width / sizeFactor,
              height: height / sizeFactor,
            },
            design: response.data,
            designLayers: response.data.productDetail,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invitationId]);

  return (
    <div className="flex h-screen">
      <Navbar invitationId={invitationId} />
      <div className="flex flex-grow mt-[65px]">
        {/* Thanh công cụ bên trái */}
        <div className="w-[30%] overflow-y-auto border-r border-gray-300 p-4">
          <EditInvitation />
        </div>

        {/* Phần chính chứa Stage */}
        <div className="flex-1">
          <Stage
            ref={stageRef}
            width={initSize.width}
            height={initSize.height}
            style={{
              overflow: "auto",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "100%",
            }}
          >
            <Layer>
              <BackgroundLayerInvitation
                src={design?.thumn}
                width={initSize.width}
                height={initSize.height}
              />

              {designLayers.map((layer) => {
                if (layer.content?.type === "image") {
                  return (
                    <ImageLayerInvitation
                      key={layer.id}
                      designSize={{
                        width: initSize.width,
                        height: initSize.height,
                      }}
                      id={layer.id}
                      data={layer.content}
                      isSelected={layer.id === selectedLayer?.id}
                    />
                  );
                } else if (layer.content?.type === "text") {
                  return (
                    <TextLayerInvitation
                      key={layer.id}
                      designSize={{
                        width: initSize.width,
                        height: initSize.height,
                      }}
                      id={layer.id}
                      data={layer.content}
                    />
                  );
                }
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default Page;
