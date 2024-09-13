"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Toolbox from "./components/Toolbox/Toolbox";
import { useParams } from "next/navigation";
import { getListLayerApi, saveListLayer } from "../../../../api/design";
import { checkTokenCookie } from "@/utils";
import { Stage, Layer, Line } from "react-konva";
import BackgroundLayer from "./components/Editor/BackgroundLayer";
import ImageLayer from "./components/Editor/ImageLayer";
import TextLayer from "./components/Editor/TextLayer";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLayer,
  deselectLayer,
  setStageData,
  selectLayerTool,
  deselectLayerTool,
} from "@/redux/slices/editor/stageSlice";
import {
  setCurrentPage,
  setTotalPages,
} from "@/redux/slices/editor/stageSlice";
import { PanelsImage } from "./components/Panels/PanelsImage";
import { PanelsText } from "./components/Panels/PanelsText";
import PanelsCommon from "./components/Panels/PanelsCommon";
import axios from "axios";
import { toast } from "react-toastify";
import useFonts from "../../../../hooks/useLoadFont";
import { calculateTotalPages, getLayersByPage } from "@/utils/editor";

const Page = () => {
  const params = useParams();
  const { designId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const draggableDivRef = useRef(null); // New ref for the draggable div
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const [locked, setLocked] = useState(true);
  const {
    design,
    designLayers,
    initSize,
    currentPage,
    totalPages,
    selectedLayer,
  } = stageData;

  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState("Layer");
  const [isTransformerVisible, setTransformerVisible] = useState(true); // Added setTransformerVisible state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [guidelines, setGuidelines] = useState([]);

  const { fonts, loading } = useFonts();
  const [maxPositions, setMaxPositions] = useState({
    maxLeft: null,
    maxTop: null,
    centerX: null,
    centerY: null,
  });

  const fetchData = async () => {
    try {
      const response = await getListLayerApi({
        idproduct: designId,
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
          sizeFactor = 1.5;
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
        //Lấy ra page đầu tiên
        const pageLayers = getLayersByPage(response.data.productDetail, 0);
        const totalPages = calculateTotalPages(response.data.productDetail);

        dispatch(
          setCurrentPage({
            page: 0,
            pageLayers: pageLayers,
          })
        );
        dispatch(setTotalPages(totalPages));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [designId]);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleDuplicateLayer = () => {
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
              console.log(response);

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
      } catch (error) {
        console.error("Error saving design:", error);
      }
    };

    handleSaveDesign();
    const copyLayer = async () => {
      try {
        const res = await axios.post(
          `https://apis.ezpics.vn/apis/copyLayerAPI`,
          {
            idproduct: designId,
            token: checkTokenCookie(),
            idlayer: selectedId,
          }
        );
        if (res.data.code === 1) {
          toast.success("Nhân bản layer đã chọn thành công", {
            autoClose: 500,
          });
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    };
    copyLayer();
  };

  const handleMaxPositionUpdate = useCallback(
    (maxLeft, maxTop, centerX, centerY) => {
      setMaxPositions({ maxLeft, maxTop, centerX, centerY });
    },
    []
  );

  useEffect(() => {
    const items = Array.from(stageData.designLayers);
    if (Array.isArray(items)) {
      const allLocked = items.every((layer) => layer.content.lock === 1);
      setLocked(allLocked);
    }
  }, [stageData.designLayers]);

  const handleMouseDown = (e) => {
    if (
      draggableDivRef.current &&
      draggableDivRef.current.contains(e.target) &&
      locked
    ) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && locked) {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
        dispatch(deselectLayer());
      }
    }
  };

  const checkAlignment = (x, y, currentLayer) => {
    const layers = stageRef.current.children[0].children;
    let newGuidelines = [];
    let horizontalGuidelines = new Set();
    let verticalGuidelines = new Set();

    // Lưu lại các bounding box của currentLayer
    const currentBox = currentLayer.getClientRect();

    layers.forEach((layer) => {
      if (layer === currentLayer || layer.attrs.alt === "background") {
        return;
      }

      const shapeBox = layer.getClientRect();

      // Tính toán khoảng cách giữa các cạnh
      const horizontalDistanceStart = Math.abs(shapeBox.x - currentBox.x);
      const horizontalDistanceEnd = Math.abs(
        shapeBox.x + shapeBox.width - (currentBox.x + currentBox.width)
      );
      const verticalDistanceStart = Math.abs(shapeBox.y - currentBox.y);
      const verticalDistanceEnd = Math.abs(
        shapeBox.y + shapeBox.height - (currentBox.y + currentBox.height)
      );

      // Kiểm tra căn chỉnh ngang
      if (horizontalDistanceStart < 0.7 || horizontalDistanceEnd < 0.7) {
        const xStart = shapeBox.x < currentBox.x ? shapeBox.x : currentBox.x;
        const xEnd =
          shapeBox.x + shapeBox.width > currentBox.x + currentBox.width
            ? shapeBox.x + shapeBox.width
            : currentBox.x + currentBox.width;
        if (!horizontalGuidelines.has(xStart)) {
          horizontalGuidelines.add(xStart);
          newGuidelines.push({
            x: xStart,
            y1: 0,
            y2: stageRef.current.height(),
          });
        }
        if (!horizontalGuidelines.has(xEnd)) {
          horizontalGuidelines.add(xEnd);
          newGuidelines.push({ x: xEnd, y1: 0, y2: stageRef.current.height() });
        }
      }

      // Kiểm tra căn chỉnh dọc
      if (verticalDistanceStart < 0.7 || verticalDistanceEnd < 0.7) {
        const yStart = shapeBox.y < currentBox.y ? shapeBox.y : currentBox.y;
        const yEnd =
          shapeBox.y + shapeBox.height > currentBox.y + currentBox.height
            ? shapeBox.y + shapeBox.height
            : currentBox.y + currentBox.height;
        if (!verticalGuidelines.has(yStart)) {
          verticalGuidelines.add(yStart);
          newGuidelines.push({
            y: yStart,
            x1: 0,
            x2: stageRef.current.width(),
          });
        }
        if (!verticalGuidelines.has(yEnd)) {
          verticalGuidelines.add(yEnd);
          newGuidelines.push({ y: yEnd, x1: 0, x2: stageRef.current.width() });
        }
      }
    });

    // Cập nhật state để hiển thị các đường căn chỉnh
    setGuidelines(newGuidelines);
  };

  const deleteOldLine = () => {
    setGuidelines([]);
  };

  // console.log(stageData);

  return (
    <>
      <Navbar
        stageRef={stageRef}
        setTransformerVisible={setTransformerVisible}
      />
      <div className="h-screen pt-[65px] overflow-hidden">
        <Toolbox
          onToolChange={setActiveTool}
          activeTool={activeTool}
          stageRef={stageRef}
        />
        <div
          className={`
          relative ${
            activeTool ? "w-[calc(100%-408px)]" : "w-[calc(100%-108px)]"
          } h-full
          z-1 bg-gray-300 transition-all duration-300 ${
            activeTool ? "ml-[408px]" : "ml-[108px]"
          }`}
        >
          {stageData.selectedLayer?.content?.type === "image" ? (
            <div>
              <PanelsImage
                selectedId={selectedId}
                maxPositions={maxPositions}
                onDuplicateLayer={handleDuplicateLayer}
                fetchData={fetchData}
              />
            </div>
          ) : stageData.selectedLayer?.content?.type === "text" ? (
            <div>
              <PanelsText
                maxPositions={maxPositions}
                onDuplicateLayer={handleDuplicateLayer}
                onColorButtonClick={() => setActiveTool("Color")}
                onFontsButtonClick={() => setActiveTool("Fonts")}
                vwHeight={initSize.height}
                vwWidth={initSize.width}
              />
            </div>
          ) : (
            <div className="stick border-l border-slate-300 h-[50px] bg-white"></div>
          )}
          <div
            className="flex overflow-auto h-[calc(100%-100px)] justify-around items-center"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={previewRef}
            onClick={handleClickOutSide}
          >
            <div ref={containerRef} className="mt-[300px] mb-[50px]">
              <div
                ref={draggableDivRef}
                style={{
                  width: initSize.width,
                  height: initSize.height,
                  transform: locked
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
                    : "none",
                }}
              >
                <Stage
                  ref={stageRef}
                  width={initSize.width}
                  height={initSize.height}
                  style={{
                    // zIndex: -1,
                    overflow: "auto",
                    backgroundColor: "#fff",
                  }}
                  onMouseDown={checkDeselect}
                  onTouchStart={checkDeselect}
                >
                  <Layer>
                    <BackgroundLayer
                      src={design?.thumn}
                      width={initSize.width}
                      height={initSize.height}
                    />

                    {currentPage?.pageLayers.map((layer) => {
                      if (layer.content?.type === "image") {
                        return (
                          <ImageLayer
                            key={layer.id}
                            designSize={{
                              width: initSize.width,
                              height: initSize.height,
                            }}
                            id={layer.id}
                            data={layer.content}
                            isSelected={layer.id === selectedLayer?.id}
                            isSelectedFromToolbox={
                              layer.id === stageData?.selectedLayer?.id
                            }
                            onSelect={() => {
                              setSelectedId(layer.id);
                              dispatch(selectLayer({ id: layer.id }));
                            }}
                            isTransformerVisible={isTransformerVisible}
                            onMaxPositionUpdate={handleMaxPositionUpdate}
                            isDraggable={!locked} // Only allow dragging when unlocked
                            stageRef={stageRef}
                            containerRef={containerRef}
                            checkAlignment={checkAlignment}
                            deleteOldLine={deleteOldLine}
                          />
                        );
                      } else if (layer.content?.type === "text") {
                        return (
                          <TextLayer
                            key={layer.id}
                            designSize={{
                              width: initSize.width,
                              height: initSize.height,
                            }}
                            id={layer.id}
                            data={layer.content}
                            isSelected={layer.id === selectedLayer?.id}
                            isSelectedFromToolbox={
                              layer.id === stageData?.selectedLayer?.id
                            }
                            onSelect={() => {
                              setSelectedId(layer.id);
                              dispatch(selectLayer({ id: layer.id }));
                            }}
                            isTransformerVisible={isTransformerVisible}
                            stageRef={stageRef}
                            isDraggable={!locked}
                            containerRef={containerRef}
                          />
                        );
                      }
                    })}
                    {guidelines.map((line, index) => (
                      <Line
                        key={index}
                        points={
                          line.x !== undefined
                            ? [line.x, line.y1, line.x, line.y2]
                            : [line.x1, line.y, line.x2, line.y]
                        }
                        stroke="rgba(255, 0, 0, 0.8)" // Thay đổi màu sắc
                        strokeWidth={0.4} // Tăng độ dày
                        dash={[10, 5]} // Định dạng kiểu đường nét đứt
                        opacity={1} // Độ trong suốt
                        lineCap="round" // Đầu đường bo tròn
                        lineJoin="round" // Góc đường bo tròn
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
          <div
            className={`fixed bottom-0 z-10 ${
              activeTool ? "w-[calc(100%-408px)]" : "w-[calc(100%-108px)]"
            }`}
          >
            <Footer containerRef={containerRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
