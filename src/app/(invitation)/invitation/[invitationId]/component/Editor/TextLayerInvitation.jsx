import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { selectLayer, updateLayer } from "@/redux/slices/print/printSlice";

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

  const formatText = (text) => {
    // Thay thế các thẻ <br /> và <br> bằng ký tự xuống dòng
    return text.replace(/<br\s*\/?>/gi, "\n");
  };

  
  // Hàm chuyển đổi từ vh sang pixel và từ pixel sang tỷ lệ lineHeight
  const giandongToLineHeight = (giandong) => {
    if (typeof giandong === "string" && giandong.endsWith("vh")) {
      const vhValue = parseFloat(giandong);
      if (!isNaN(vhValue)) {
        const lineHeightInPx = (vhValue / 100) * designSize.height; // Chuyển đổi từ vh sang px
        return lineHeightInPx / sizeValue; // Chuyển đổi từ px sang tỷ lệ
      }
    }
    // Nếu không phải là dạng vh, trả về giá trị parseFloat hoặc giá trị mặc định
    const parsedValue = parseFloat(giandong);
    return isNaN(parsedValue) ? 1 : parsedValue;
  };

  // Hàm chuyển đổi từ vw sang pixel và từ pixel sang giá trị letterSpacing
  const vwToLetterSpacing = (vw) => {
    if (typeof vw === "string" && vw.endsWith("vw")) {
      const vwValue = parseFloat(vw);
      if (!isNaN(vwValue)) {
        return (vwValue / 100) * designSize.width; // Chuyển đổi từ vw sang px
      }
    }
    return parseFloat(vw) || 0; // Giá trị mặc định nếu không thể chuyển đổi
  };

  return (
    <>
      <Text
        ref={shapeRef}
        text={formatText(textValue)}
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
        letterSpacing={vwToLetterSpacing(gianchu)}
        lineHeight={giandongToLineHeight(giandong)}
      />
    </>
  );
}
