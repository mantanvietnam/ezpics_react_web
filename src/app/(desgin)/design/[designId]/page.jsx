"use client"
import { useEffect, useRef, useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import Toolbox from "./components/Toolbox/Toolbox"
import { useParams } from "next/navigation"
import { getListLayerApi } from "../../../../api/design"
import { checkTokenCookie } from "@/utils"
import { Stage, Layer, Rect, Image } from "react-konva"
import BackgroundLayer from "./components/Editor/BackgroundLayer"
import ImageLayer from "./components/Editor/ImageLayer"
import TextLayer from "./components/Editor/TextLayer"
import { useDispatch, useSelector } from 'react-redux'
import { setStageData } from '@/redux/slices/editor/stageSlice'
import PanelsImage from "./components/Panels/PanelsImage";

const Page = () => {
  const params = useParams()
  const { designId } = params
  const stageRef = useRef(null)
  console.log('🚀 ~ Page ~ stageRef:', stageRef)
  const dispatch = useDispatch()
  const stageData = useSelector((state) => state.stage.stageData);
  console.log('🚀 ~ Page ~ stageData:', stageData)

  const [design, setDesign] = useState();
  const [designLayers, setDesignLayers] = useState([]);
  const [initSize, setInitSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);

  const [activeTool, setActiveTool] = useState("Layer");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListLayerApi({
          idproduct: designId,
          token: checkTokenCookie(),
        });
        if (response.code === 1) {
          setDesign(response.data);
          setDesignLayers(response.data.productDetail);

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
            sizeFactor = 1.5;
          } else {
            sizeFactor = 2;
          }

          setInitSize({
            width: width / sizeFactor,
            height: height / sizeFactor,
          })
          //Lưu thông tin design hiện tại vào redux
          dispatch(setStageData({
            initSize: {
              width: width / sizeFactor,
              height: height / sizeFactor,
            },
            design: response.data,
            layers: response.data.productDetail
          }))
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData()
  }, [designId])

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    console.log('No layer active');
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const updateDesign = () => {
    // 
  }


  return (
    <>
      <Navbar />
      <div style={{ height: "100vh", padding: "65px 0px 0px 0px" }}>
        <Toolbox onToolChange={setActiveTool} stageRef={stageRef} />
        <div
          className={`relative z-1 bg-gray-300 h-[calc(100%-50px)] transition-all duration-300 ${activeTool ? "ml-[396px]" : "ml-[96px]"
            }`}>
          <PanelsImage />
          <div className="flex h-[100%] justify-center items-center">
            <Stage
              ref={stageRef}
              width={initSize.width}
              height={initSize.height}
              className="bg-white"
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}>
              <Layer>
                <BackgroundLayer
                  src={design?.thumn}
                  width={initSize.width}
                  height={initSize.height}
                />
              </Layer>

              {designLayers.map((layer) => {
                if (layer.content.type === "image") {
                  return (
                    <Layer key={layer.id}>
                      <ImageLayer
                        designSize={{
                          width: initSize.width,
                          height: initSize.height,
                        }}
                        id={layer.id}
                        data={layer.content}
                        isSelected={layer.id === selectedId}
                        onSelect={() => {
                          setSelectedId(layer.id);
                        }}
                      />
                    </Layer>
                  );
                } else if (layer.content.type === "text") {
                  return (
                    <Layer key={layer.id}>
                      <TextLayer
                        designSize={{
                          width: initSize.width,
                          height: initSize.height,
                        }}
                        id={layer.id}
                        data={layer.content}
                        isSelected={layer.id === selectedId}
                        onSelect={() => {
                          setSelectedId(layer.id);
                        }}
                      />
                    </Layer>
                  );
                }
              })}
            </Stage>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
