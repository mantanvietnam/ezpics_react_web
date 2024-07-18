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

const Page = () => {
  const params = useParams();
  const { designId } = params;

  const [design, setDesign] = useState();
  const [designLayers, setDesignLayers] = useState([]);
  const [initSize, setInitSize] = useState({ width: 0, height: 0 });

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
          if (response.data.width >= 3000 || response.data.height >= 3000) {
            setInitSize({
              width: response.data.width / 5,
              height: response.data.height / 5,
            });
          } else if (
            response.data.width >= 1920 ||
            response.data.height >= 1920
          ) {
            setInitSize({
              width: response.data.width / 5,
              height: response.data.height / 5,
            });
          } else if (
            response.data.width >= 1600 ||
            response.data.height >= 1600
          ) {
            setInitSize({
              width: response.data.width / 4,
              height: response.data.height / 4,
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
              width: response.data.width,
              height: response.data.height,
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

  console.log("🚀 ~ Page ~ design:", design);
  console.log("🚀 ~ Page ~ designLayers:", designLayers);

  return (
    <>
      <div style={{ height: "100vh" }} className="relative">
        <Navbar />
        <Toolbox />
        {/* <div className='edit-container editor-nav bg-red-200 ml-[396px] flex items-center justify-center absolute'>
         */}
        <div className="relative z-1 bg-gray-300 h-[100%] ml-[396px]">
          <div className="flex h-[100%] justify-center items-center">
            <Stage
              width={initSize.width}
              height={initSize.height}
              className="bg-white">
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
                        data={layer.content}
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
