"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { setStageData } from "@/redux/slices/editor/stageSlice";
import PanelsImage from "./components/Panels/PanelsImage";
import PanelsCommon from "./components/Panels/PanelsCommon"

const Page = () => {
  const params = useParams();
  const { designId } = params;
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { design, designLayers, initSize } = stageData;

  const [selectedId, setSelectedId] = useState(null)
  const [activeTool, setActiveTool] = useState("Layer")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListLayerApi({
          idproduct: designId,
          token: checkTokenCookie(),
        })
        if (response.code === 1) {
          const { width, height } = response.data

          let sizeFactor
          if (width >= 4000 || height >= 4000) {
            sizeFactor = 7
          } else if (width >= 3000 || height >= 3000) {
            sizeFactor = 5
          } else if (width >= 2500 || height >= 2500) {
            sizeFactor = 3
          } else if (width >= 1920 || height >= 1920) {
            sizeFactor = 2.5
          } else if (width >= 1600 || height >= 1600) {
            sizeFactor = 1.5
          } else if (width >= 1000 || height >= 1000) {
            sizeFactor = 1.5
          } else if (width >= 500 || height >= 500) {
            sizeFactor = 1.5
          } else {
            sizeFactor = 2
          }

          dispatch(setStageData({
            initSize: {
              width: width / sizeFactor,
              height: height / sizeFactor,
            },
            design: response.data,
            designLayers: response.data.productDetail
          }));
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [designId])

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null)
    }
  }

  console.log('🚀 ~ Page ~ designLayers:', designLayers)

  return (
    <>
      <Navbar />
      <div className="h-screen pt-[65px] overflow-hidden">
        <Toolbox onToolChange={setActiveTool} stageRef={stageRef} />
        <div className={`
          relative w-full h-full
          z-1 bg-gray-300 h-[calc(100%)] transition-all duration-300 ${activeTool ? "ml-[396px]" : "ml-[96px]"}`}>
          <div className="fixed top-50 z-10 w-full">
            <PanelsImage />
          </div>
          <div className="flex overflow-auto h-[calc(100%-50px)] justify-around items-center">
            <div ref={containerRef}>
              <div
                
                style={{ width: initSize.width, height: initSize.height }}
              >
                <Stage
                  ref={stageRef}
                  width={initSize.width}
                  height={initSize.height}
                  className="bg-white"
                  style={{ zIndex: -1, overflow: "auto" }}
                  onMouseDown={checkDeselect}
                  onTouchStart={checkDeselect}
                >
                  <Layer>
                    <BackgroundLayer
                      src={design?.thumn}
                      width={initSize.width}
                      height={initSize.height}
                    />
                  </Layer>
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
                        onSelect={() => {
                          setSelectedId(layer.id)
                        }}
                      />
                    )
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
                        onSelect={() => {
                          setSelectedId(layer.id)
                        }}
                      />
                    )
                  }
                })}
                </Stage>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 z-10 w-full">
            <Footer containerRef={containerRef} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
