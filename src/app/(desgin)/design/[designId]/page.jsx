"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Toolbox from "./components/Toolbox/Toolbox";
import { useParams } from "next/navigation";
import { getListLayerApi } from "../../../../api/design";
import { checkTokenCookie } from "@/utils";
import { Stage, Layer } from "react-konva";
import BackgroundLayer from "./components/Editor/BackgroundLayer";
import ImageLayer from "./components/Editor/ImageLayer";
import TextLayer from "./components/Editor/TextLayer";
import { useDispatch, useSelector } from "react-redux";
import { selectLayer, setStageData } from "@/redux/slices/editor/stageSlice";
import { PanelsImage } from "./components/Panels/PanelsImage";
import { PanelsText } from "./components/Panels/PanelsText";
import PanelsCommon from "./components/Panels/PanelsCommon";
import axios from "axios";
import { toast } from "react-toastify";
import useFonts from "../../../../hooks/useLoadFont";

const Page = () => {
  const params = useParams();
  const { designId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  console.log('================================================', stageData?.selectedLayer?.id);
  const { design, designLayers, initSize } = stageData;

  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState("Layer");
  const [isTransformerVisible, setTransformerVisible] = useState(true);

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
        toast.success("Nhân bản layer đã chọn thành công");
        fetchData();
        dispatch();
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

  return (
    <>
      <Navbar
        stageRef={stageRef}
        setTransformerVisible={setTransformerVisible}
      />
      <div className="h-screen pt-[65px] overflow-hidden">
        <Toolbox onToolChange={setActiveTool} activeTool={activeTool} />
        <div
          className={`
          relative ${activeTool ? "w-[calc(100%-408px)]" : "w-[calc(100%-108px)]"
            } h-full
          z-1 bg-gray-300 h-[calc(100%)] transition-all duration-300 ${activeTool ? "ml-[408px]" : "ml-[108px]"
            }`}>
          {stageData.selectedLayer?.content?.type === "image" ? (
            <div>
              <PanelsImage
                selectedId={selectedId}
                maxPositions={maxPositions}
                onDuplicateLayer={handleDuplicateLayer}
                onMasksButtonClick={() => setActiveTool("Masks")}
              />
            </div>
          ) : stageData.selectedLayer?.content?.type === "text" ? (
            <div>
              <PanelsText
                maxPositions={maxPositions}
                onColorButtonClick={() => setActiveTool("Color")}
                onFontsButtonClick={() => setActiveTool("Fonts")}
              />
            </div>
          ) : (
            <div className="stick border-l border-slate-300 h-[50px] bg-white"></div>
          )}
          <div className="flex overflow-auto h-[calc(100%-50px)] justify-around items-center">
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
                  onMouseDown={checkDeselect}
                  onTouchStart={checkDeselect}>
                  <Layer>
                    <BackgroundLayer
                      src={design?.thumn}
                      width={initSize.width}
                      height={initSize.height}
                    />
                    {designLayers.map((layer) => {
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
                            isSelectedFromToolbox={layer.id === stageData?.selectedLayer?.id}
                            onSelect={() => {
                              setSelectedId(layer.id)
                              dispatch(selectLayer({ id: layer.id }));
                            }}
                            onMaxPositionUpdate={handleMaxPositionUpdate}
                            isTransformerVisible={isTransformerVisible}
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
                            isSelectedFromToolbox={layer.id === stageData?.selectedLayer?.id}
                            onSelect={() => {
                              setSelectedId(layer.id);
                              dispatch(selectLayer({ id: layer.id }));
                            }}
                            isTransformerVisible={isTransformerVisible}
                            containerRef={containerRef}
                            stageRef={stageRef}
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
            className={`fixed bottom-0 z-10 ${activeTool ? "w-[calc(100%-408px)]" : "w-[calc(100%-108px)]"
              }`}>
            <Footer containerRef={containerRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
