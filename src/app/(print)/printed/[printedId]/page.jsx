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

  useEffect(() => {
    if (stageData && stageData.designLayers) {
      setDesignLayer(stageData.designLayers);
    }
  }, [stageData]);

  // console.log("🚀 ~ stageData :", designLayers);

  const fetchData = async () => {
    try {
      const response = await getListLayerApi({
        idproduct: printedId,
        token: checkTokenCookie(),
      });
      if (response.code === 1) {
        const { width, height } = response.data;

        let sizeFactor;
        if (width >= 4000 || height >= 4000) {
          sizeFactor = 7;
        } else if (width >= 3000 || height >= 3000) {
          sizeFactor = 5;
        } else if (width >= 2500 || height >= 2500) {
          sizeFactor = 3;
        } else if (width >= 1920 || height >= 1920) {
          sizeFactor = 2.5;
        } else if (width >= 1600 || height >= 1600) {
          sizeFactor = 2;
        } else if (width >= 1000 || height >= 1000) {
          sizeFactor = 1.5;
        } else if (width >= 500 || height >= 500) {
          sizeFactor = 1;
        } else {
          sizeFactor = 2;
        }

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [printedId]);

  return (
    <div className="flex overflow-auto h-screen justify-around items-center bg-[#222831]">
      <div className="logo flex items-center justify-center absolute left-[2%] top-[2%]">
        <Link href="/" className="flex flex-center">
          <Image
            className="object-contain rounded_image inline"
            priority={true}
            src={images.logo}
            style={{ maxWidth: "40px", maxHeight: "40px" }}
            alt="Ezpics Logo"
          />
        </Link>
      </div>
      <div ref={containerRef}>
        <div style={{ width: initSize.width, height: initSize.height }}>
          <Stage
            ref={stageRef}
            width={initSize.width}
            height={initSize.height}
            style={{
              zIndex: -1,
              overflow: "auto",
              backgroundColor: "#fff",
            }}
            draggable={false}
            onMouseDown={(e) => e.target.getStage().draggable(false)}>
            <Layer>
              <BackgroundLayerPrint
                src={design?.thumn}
                width={initSize.width}
                height={initSize.height}
                draggable={false}
              />
              {designLayers.map((layer) => {
                if (layer.content?.type === "image") {
                  // console.log("Render image layer", layer.content);
                  return (
                    <ImageLayerPrint
                      key={layer.id}
                      designSize={{
                        width: initSize.width,
                        height: initSize.height,
                      }}
                      id={layer.id}
                      data={layer.content}
                    />
                  );
                } else if (layer.content?.type === "text") {
                  // console.log("Render text layer", layer.content);
                  return (
                    <TextLayerPrint
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
      {loading ? (
        <div></div>
      ) : (
        <div>
          <EditPrint stageRef={stageRef} />
        </div>
      )}

      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "absolute",
            zIndex: 20000000000,
          }}>
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
                // alignSelf: 'center',
                zIndex: 999999,
              }}
              alt=""
              width={50}
              height={50}
              src="/images/EZPICS.png"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
