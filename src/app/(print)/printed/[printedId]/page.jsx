"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { getListLayerApi } from "@/api/design";
import { checkTokenCookie } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { setStageData } from "@/redux/slices/editor/stageSlice";
import { Stage, Layer } from "react-konva";
import BackgroundLayerPrint from "./components/BackgroundLayerPrint";
import ImageLayerPrint from "./components/ImageLayerPrint";
import TextLayerPrint from "./components/TextLayerPrint";
import EditPrint from "./components/EditPrint";
import images from "../../../../../public/images/index2";
import Link from "next/link";
import Image from "next/image";
import "@/styles/loading.css";

const Page = () => {
  const params = useParams();
  const { printedId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { design, initSize } = stageData;
  const [loading, setLoading] = useState(true);
  const [designLayers, setDesignLayer] = useState([]);
  const [sizeRespon, setSizeRespon] = useState(1); // Initial sizeRespon

  useEffect(() => {
    if (stageData && stageData.designLayers) {
      setDesignLayer(stageData.designLayers);
    }
  }, [stageData]);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      console.log("Window width:", windowWidth); // Check window width

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
      console.log("New sizeRespon:", newSizeRespon); // Check new sizeRespon value
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
        idproduct: printedId,
        token: checkTokenCookie(),
      });
      if (response.code === 1) {
        const { width, height } = response.data;
        let sizeFactor;

        // Determine sizeFactor based on dimensions
        sizeFactor =
          width >= 4000 || height >= 4000
            ? 7
            : width >= 3000 || height >= 3000
            ? 5
            : width >= 2500 || height >= 2500
            ? 3
            : width >= 1920 || height >= 1920
            ? 2.5
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
  }, [printedId]);

  return (
    <div className="flex flex-col lg:flex-row overflow-auto h-screen pt-[70px] mobile:pt-[0] mobile:justify-around items-center bg-[#222831]">
      <div className="logo flex items-center justify-center absolute top-4 left-4 lg:top-6 lg:left-6">
        <Link href="/" className="flex flex-center">
          <Image
            className="object-contain rounded_image"
            priority={true}
            src={images.logo}
            style={{ maxWidth: "40px", maxHeight: "40px" }}
            alt="Ezpics Logo"
          />
        </Link>
      </div>
      <div ref={containerRef} className="stage-container">
        <div
          style={{
            width: initSize.width / sizeRespon,
            height: initSize.height / sizeRespon,
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}>
          <Stage
            ref={stageRef}
            width={initSize.width / sizeRespon}
            height={initSize.height / sizeRespon}
            style={{
              zIndex: 1,
              overflow: "auto",
              backgroundColor: "#fff",
            }}
            draggable={false}
            onMouseDown={(e) => e.target.getStage().draggable(false)}>
            <Layer>
              <BackgroundLayerPrint
                src={design?.thumn}
                width={initSize.width / sizeRespon}
                height={initSize.height / sizeRespon}
                draggable={false}
              />
              {designLayers.map((layer) => {
                if (layer.content?.type === "image") {
                  return (
                    <ImageLayerPrint
                      key={layer.id}
                      designSize={{
                        width: initSize.width / sizeRespon,
                        height: initSize.height / sizeRespon,
                      }}
                      id={layer.id}
                      data={layer.content}
                    />
                  );
                } else if (layer.content?.type === "text") {
                  return (
                    <TextLayerPrint
                      key={layer.id}
                      designSize={{
                        width: initSize.width / sizeRespon,
                        height: initSize.height / sizeRespon,
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
      {loading ? (
        <div className="loading-overlay">
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
            <div className="ldio-4qpid53rus92">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <Image
              style={{
                position: "absolute",
                top: 25,
                left: 30,
                width: 40,
                height: 40,
                zIndex: 999999,
              }}
              alt=""
              width={50}
              height={50}
              src="/images/EZPICS.png"
            />
          </div>
        </div>
      ) : (
        <EditPrint stageRef={stageRef} />
      )}
    </div>
  );
};

export default Page;
