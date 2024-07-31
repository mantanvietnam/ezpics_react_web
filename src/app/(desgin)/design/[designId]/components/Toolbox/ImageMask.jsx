import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLayerImage } from "@/redux/slices/editor/stageSlice";
import { checkTokenCookie } from "@/utils";
import { addLayerImageUrlAPI } from "@/api/design";
import { getSVGDefinitions, getSVGSampleDefinitions, SVG_TYPES } from "../../../../../../../public/svg/svgDefinitions";

const ImageMask = () => {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const [imageLink, setImageLink] = useState("");
  const [svgType, setSvgType] = useState("circle");

  const handleMaskClick = async (type) => {
    setSvgType(type);
    if (selectedLayer && selectedLayer.content.type === "image") {
      try {
        const res = await addLayerImageUrlAPI({
          idproduct: stageData.design.id,
          token: checkTokenCookie(),
          imageUrl: selectedLayer.content.banner,
          page: 0,
        });
        console.log("res.data.data", res.data);
        const svgString = createSVGString(res.data.imageUrl, type);
        dispatch(addLayerImage({ svgString }));
        setImageLink(selectedLayer.content.banner);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createSVGString = (imageUrl, type) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
        <defs>
          ${type === "circle" ? '<clipPath id="circleView"><circle cx="120" cy="120" r="100" /></clipPath>' : ''}
          ${type === "rect" ? '<clipPath id="rectView"><rect x="20" y="20" width="200" height="200" /></clipPath>' : ''}
          ${type === "star" ? '<clipPath id="starView"><polygon points="120,20 140,80 200,80 150,120 170,180 120,140 70,180 90,120 40,80 100,80" /></clipPath>' : ''}
        </defs>
        <image width="240" height="240" xlinkHref="${imageUrl}" clipPath="url(#${type}View)" />
      </svg>
    `;
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <h4 className="py-2 text-lg font-bold">Mask Image</h4>
      <div className="mb-2">
        <label className="mr-2">Select SVG Type:</label>
        <div className="flex space-x-4">
          {SVG_TYPES.map(({ type, name }) => (
            <div key={type} className="flex flex-col items-center cursor-pointer" onClick={() => handleMaskClick(type)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                style={{ border: svgType === type ? '2px solid blue' : 'none' }}
              >
                <defs>
                  {getSVGSampleDefinitions(type)}
                </defs>
                <g clipPath={`url(#${type}SampleView)`}>
                  <rect width="80" height="80" fill="black" />
                </g>
              </svg>
              <span className="text-sm mt-1">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="240"
          height="240"
          viewBox="0 0 240 240"
          onClick={() => handleMaskClick(svgType)}>
          <defs>
            {getSVGDefinitions(svgType)}
          </defs>
          {imageLink ? (
            <image 
              width="240" 
              height="240" 
              xlinkHref={imageLink}
              clipPath={`url(#${svgType}View)`}
            />
          ) : (
            <g clipPath={`url(#${svgType}View)`}>
              <rect width="240" height="240" fill="black" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ImageMask;
