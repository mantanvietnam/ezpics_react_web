"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { getListLayerApi } from "@/api/design";
import { checkTokenCookie } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setStageData,
  moveLayerToFront,
  moveLayerToFinal,
} from "@/redux/slices/print/printSlice";
import { Stage, Layer } from "react-konva";
import BackgroundLayerPrint from "./components/BackgroundLayerPrint";
import ImageLayerPrint from "./components/ImageLayerPrint";
import TextLayerPrint from "./components/TextLayerPrint";
import EditPrint from "./components/EditPrint";
import images from "../../../../../public/images/index2";
import Link from "next/link";
import Image from "next/image";
import "@/styles/loading.css";
import useFonts from "../../../../hooks/useLoadFont";

const Page = () => {
  const params = useParams();
  const { printedId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.print.stageData);
  const { design, initSize, selectedLayer } = stageData;
  const [loading, setLoading] = useState(true);
  const [designLayers, setDesignLayer] = useState([]);
  const [sizeRespon, setSizeRespon] = useState(1); // Initial sizeRespon
  const { fonts, setFonts } = useFonts();

  useEffect(() => {
    if (stageData && stageData.designLayers) {
      setDesignLayer(stageData.designLayers);
    }
  }, [stageData]);

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
  }, [printedId]);

  //Select bien anh

  const [layerImageId, setLayerImageId] = useState(null);

  const handleStageMouseDown = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition(); // Lấy vị trí của con trỏ
    const clickedLayers = stage.getAllIntersections(pointerPosition); // Tìm tất cả các layer tại vị trí này

    // Duyệt qua tất cả các lớp được nhấp vào
    for (let i = 0; i < clickedLayers.length; i++) {
      const clickedLayer = clickedLayers[i];
      const layerId = clickedLayer.attrs.id; // Lấy id của layer được nhấp vào

      // Tìm lớp tương ứng trong danh sách các lớp
      const layer = designLayers.find((layer) => layer.id === layerId);

      // Kiểm tra nếu lớp này là lớp biến
      if (
        layer &&
        layer.content?.variable &&
        layer.content.variable.trim() !== ""
      ) {
        // Nếu là lớp biến, cập nhật selectedLayer và dừng vòng lặp
        dispatch(setStageData({ ...stageData, selectedLayer: layer }));
        dispatch(moveLayerToFront({ id: layer.id }));
        setLayerImageId(layer.id);
        return;
      }
    }

    // Nếu không có lớp biến nào được chọn, bỏ chọn lớp hiện tại
    dispatch(setStageData({ ...stageData, selectedLayer: null }));
  };

  const previewRef = useRef(null);

  const handleClickOutSide = (event) => {
    const outerDiv = previewRef.current;
    const innerDiv = containerRef.current;

    if (outerDiv && innerDiv) {
      const outerRect = outerDiv.getBoundingClientRect();
      const innerRect = innerDiv.getBoundingClientRect();

      // Vị trí click tương đối với outerDiv
      const clickX = event.clientX - outerRect.left;
      const clickY = event.clientY - outerRect.top;

      // Kiểm tra nếu vị trí click nằm ngoài innerDiv nhưng trong outerDiv
      if (
        clickX < innerRect.left - outerRect.left ||
        clickX > innerRect.right - outerRect.left ||
        clickY < innerRect.top - outerRect.top ||
        clickY > innerRect.bottom - outerRect.top
      ) {
        dispatch(moveLayerToFinal({ id: layerImageId }));
      }
    }
  };

  return (
    <div
      ref={previewRef}
      onClick={handleClickOutSide}
      className="flex flex-col lg:flex-row overflow-auto h-full mobile:h-screen pt-[70px] pb-[30px] mobile:pt-[0] mobile:justify-around items-center bg-[#222831]"
    >
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
          }}
        >
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
            onMouseDown={handleStageMouseDown}
            onTouchStart={handleStageMouseDown}
          >
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
                      isSelected={layer.id === selectedLayer?.id}
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
        <EditPrint stageRef={stageRef} printedId={printedId} />
      )}
    </div>
  );
};

export default Page;
