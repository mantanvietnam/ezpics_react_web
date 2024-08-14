"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Toolbox from "./components/Toolbox/Toolbox";
import { useParams } from "next/navigation";
import { getListLayerApi, saveListLayer } from "../../../../api/design";
import { checkTokenCookie } from "@/utils";
import { Stage, Layer } from "react-konva";
import BackgroundLayer from "./components/Editor/BackgroundLayer";
import ImageLayer from "./components/Editor/ImageLayer";
import TextLayer from "./components/Editor/TextLayer";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLayer,
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
  const draggableDivRef = useRef(null); // New ref for the draggable div
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const [locked, setLocked] = useState(true);
  const { design, designLayers, initSize, currentPage, totalPages } = stageData;

  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState("Layer");
  const [isTransformerVisible, setTransformerVisible] = useState(true); // Added setTransformerVisible state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    // console.log("🚀 ~ Page ~ currentPage:", currentPage);
    // console.log("🚀 ~ Page ~ totalPages:", totalPages);

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleDuplicateLayer = () => {
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
          toast.success("Nhân bản layer đã chọn thành công");
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

  const handleLayerClick = (layerId) => {
    if (stageData?.selectedLayer?.id === layerId) {
      dispatch(deselectLayerTool());
    } else {
      dispatch(selectLayerTool({ id: layerId }));
    }
  };

  console.log("🚀 ~ Layer ~ selected:", stageData.selectedLayer);
  // console.log("🚀 ~ Layer ~ designLayers:", designLayers);

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
          z-1 bg-gray-300 h-[calc(100%)] transition-all duration-300 ${
            activeTool ? "ml-[408px]" : "ml-[108px]"
          }`}>
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
            onMouseLeave={handleMouseUp}>
            <div ref={containerRef} className="mt-[200px] mb-[50px]">
              <div
                ref={draggableDivRef}
                style={{
                  width: initSize.width,
                  height: initSize.height,
                  transform: locked
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
                    : "none",
                }}>
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
                  onTouchStart={checkDeselect}>
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
                            isSelected={layer.id === selectedId}
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
                            isSelected={layer.id === selectedId}
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
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
          <div
            className={`fixed bottom-0 z-10 ${
              activeTool ? "w-[calc(100%-408px)]" : "w-[calc(100%-108px)]"
            }`}>
            <Footer containerRef={containerRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
