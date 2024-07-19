"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Toolbox from "./components/Toolbox/Toolbox";
import { useParams } from "next/navigation";
import { getListLayerApi } from "../../../../api/design";
import { checkTokenCookie } from "@/utils";
import { Stage, Layer, Rect, Image } from "react-konva";
import BackgroundLayer from "./components/Editor/BackgroundLayer";
import ImageLayer from "./components/Editor/ImageLayer";
import TextLayer from "./components/Editor/TextLayer";
import PanelsImage from "./components/Panels/PanelsImage";
import PanelsCommon from "./components/Panels/PanelsCommon";

const Page = () => {
  const params = useParams();
  const { designId } = params;

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
          if (response.data.width >= 4000 || response.data.height >= 4000) {
            setInitSize({
              width: response.data.width / 7,
              height: response.data.height / 7,
            });
          } else if (
            response.data.width >= 4000 ||
            response.data.height >= 4000
          ) {
            setInitSize({
              width: response.data.width / 6,
              height: response.data.height / 6,
            });
          } else if (
            response.data.width >= 3000 ||
            response.data.height >= 3000
          ) {
            setInitSize({
              width: response.data.width / 5,
              height: response.data.height / 5,
            });
          } else if (
            response.data.width >= 2500 ||
            response.data.height >= 2500
          ) {
            setInitSize({
              width: response.data.width / 3,
              height: response.data.height / 3,
            });
          } else if (
            response.data.width >= 1920 ||
            response.data.height >= 1920
          ) {
            setInitSize({
              width: response.data.width / 2.5,
              height: response.data.height / 2.5,
            });
          } else if (
            response.data.width >= 1600 ||
            response.data.height >= 1600
          ) {
            setInitSize({
              width: response.data.width / 1.5,
              height: response.data.height / 1.5,
            });
          } else if (
            response.data.width >= 1000 ||
            response.data.height >= 1000
          ) {
            setInitSize({
              width: response.data.width / 1.5,
              height: response.data.height / 1.5,
            });
          } else if (
            response.data.width >= 500 ||
            response.data.height >= 500
          ) {
            setInitSize({
              width: response.data.width * 1.5,
              height: response.data.height * 1.5,
            });
          } else {
            setInitSize({
              width: response.data.width * 2,
              height: response.data.height * 2,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [designId]);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  console.log("🚀 ~ Page ~ design:", design);
  console.log("🚀 ~ Page ~ selectedId:", selectedId);

  return (
    <>
      <Navbar />
      <div
        style={{
          height: "100vh",
          padding: "64px 0px 0px 0px",
        }}>
        <Toolbox onToolChange={setActiveTool} />

        <div
          className={`relative z-1 bg-gray-300 h-[calc(100%-50px)] transition-all duration-300 ${
            activeTool ? "ml-[396px]" : "ml-[96px]"
          }`}>
          <div>
            <PanelsImage />
          </div>

          <div className="flex h-[100%] justify-center items-center">
            <Stage
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
