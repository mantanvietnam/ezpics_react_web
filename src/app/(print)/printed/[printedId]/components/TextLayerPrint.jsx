import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/print/printSlice";

export default function TextLayer(props) {
  const { data, designSize, id } = props;
  const {
    postion_left,
    postion_top,
    size,
    lock,
    status,
    indam,
    innghieng,
    gachchan,
    text_align,
    gianchu,
    giandong,
    rotate,
  } = data;

  const dispatch = useDispatch();
  const shapeRef = useRef();
  const trRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(data?.text);

  // State for dynamic offsets
  const [offsetX, setOffsetX] = useState(window.innerWidth * 0.1); // 10% of viewport width
  const [offsetY, setOffsetY] = useState(window.innerHeight * 0.05); // 5% of viewport height

  // Function to update offsets based on viewport size
  const updateOffsets = () => {
    setOffsetX(window.innerWidth * 0.1); // 10% of viewport width
    setOffsetY(window.innerHeight * 0.05); // 5% of viewport height
  };

  useEffect(() => {
    // Add resize event listener to update offsets
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  // Position of the text
  const positionX = designSize.width * (postion_left / 100);
  const positionY = designSize.height * (postion_top / 100);

  // Convert vw to px
  const sizeValue = parseFloat(size?.replace("vw", ""));
  const sizeConvertToPx = designSize.width * (sizeValue / 100);

  // Width
  const widthValue = parseFloat(
    typeof data.width === "string" ? data.width.replace("vw", "") : data.width
  );
  const width = designSize.width * (widthValue / 100);

  // Rotation
  const rotationValue = parseFloat(rotate?.replace("deg", ""));

  // Hàm để tạo giá trị fontStyle dựa trên các cờ
  const getFontStyle = (indam, innghieng) => {
    let fontStyle = "";

    if (indam === "bolder") {
      fontStyle += "bold ";
    }

    if (innghieng === "italic") {
      fontStyle += "italic";
    }

    return fontStyle.trim();
  };

  useEffect(() => {
    // Update state when data.text changes
    setTextValue(data.text || "");
  }, [data.text]);

  //   console.log("data", textValue);

  return (
    <>
      <Text
        ref={shapeRef}
        text={textValue}
        x={positionX}
        y={positionY}
        width={width}
        draggable={true}
        rotation={rotationValue}
        fill={data?.color}
        fontSize={sizeConvertToPx}
        fontFamily={data?.font}
        fontStyle={getFontStyle(indam, innghieng)}
        textDecoration={gachchan}
        align={text_align}
        letterSpacing={gianchu === "normal" ? 0 : parseFloat(gianchu)}
        lineHeight={giandong === "normal" ? 1 : parseFloat(giandong)}
      />
    </>
  );
}
