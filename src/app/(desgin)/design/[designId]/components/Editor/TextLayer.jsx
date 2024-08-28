import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, Transformer } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import {
  deselectLayerTool,
  selectLayerTool,
} from "@/redux/slices/editor/stageSlice";

export default function TextLayer(props) {
  const {
    data,
    designSize,
    isSelected,
    isSelectedFromToolbox,
    onSelect,
    onTextChange,
    id,
    isTransformerVisible,
    containerRef,
    stageRef,
  } = props;
  const {
    postion_left,
    postion_top,
    gradient_color,
    size,
    lock,
    status,
    indam,
    innghieng,
    gachchan,
    rotate,
    text_align,
    gianchu,
    giandong,
    uppercase
  } = data;
  console.log('🚀 ~ TextLayer ~ uppercase:', uppercase)

  const getScaleFromTransform = (transformString) => {
    const regex = /scale\(([^)]+)\)/;
    const match = transformString.match(regex);
    if (match) {
      const scale = parseFloat(match[1]);
      return { scaleX: scale, scaleY: scale };
    }
    return { scaleX: 1, scaleY: 1 }; // Default values if no scale found
  };

  // Get scale values from containerRef
  const containerTransform = containerRef?.current?.style.transform || "";
  const { scaleX, scaleY } = getScaleFromTransform(containerTransform);

  const dispatch = useDispatch();
  const { selectedLayer } = useSelector((state) => state.stage.stageData);

  const shapeRef = useRef();
  const trRef = useRef();
  const textareaRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(data?.text);
  const [localIsSelected, setLocalIsSelected] = useState(false);

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

  useEffect(() => {
    if (localIsSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [localIsSelected]);

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (e) => {
        if (textareaRef.current && !textareaRef.current.contains(e.target)) {
          setIsEditing(false);
          if (onTextChange) {
            onTextChange(textValue); // Call the parent callback to update text
          }
        }
      };
      window.addEventListener("click", handleClickOutside);

      return () => {
        window.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isEditing, textValue, onTextChange]);

  const handleDragEnd = (e) => {
    if (lock) return; // Prevent dragging if locked

    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
    };
    dispatch(updateLayer({ id, data }));
    // Trả layer về vị trí ban đầu sau khi di chuyển xong
    if (previousZIndex !== null) {
      shapeRef.current.setZIndex(previousZIndex);
      setPreviousZIndex(null);
    }
  };

  const handleTransform = (e) => {
    const node = shapeRef.current;
    const newScaleX = node.scaleX();
    const newScaleY = node.scaleY();
    const newWidth = node.width() * newScaleX;
    node.width(newWidth);
    node.scaleX(1);
    if (previousZIndex !== null) {
      shapeRef.current.setZIndex(previousZIndex);
      setPreviousZIndex(null);
    }
  };

  const handleTransformEnd = (e) => {
    const node = shapeRef.current;

    const data = {
      position_left: (node.x() / designSize.width) * 100,
      position_top: (node.y() / designSize.height) * 100,
      rotate: `${node.rotation()}deg`,
      width: `${((node.width() * node.scaleX()) / designSize.width) * 100}vw`,
    };
    dispatch(updateLayer({ id, data }));
    e.target.scaleX(1);
    e.target.scaleY(1);
    if (previousZIndex !== null) {
      shapeRef.current.setZIndex(previousZIndex);
      setPreviousZIndex(null);
    }
  };

  const handleDblClick = () => {
    if (lock) return; // Prevent editing if locked

    setIsEditing(true);

    setTimeout(() => {
      const node = shapeRef.current;
      const transformer = trRef.current;

      node.hide();
      transformer.hide();

      const textarea = document.createElement("textarea");
      textareaRef.current = textarea; // Store textarea reference
      document.body.appendChild(textarea);

      const textPosition = node.getClientRect();
      const stageContainer = stageRef.current.container();
      const stageRect = stageContainer.getBoundingClientRect();
      const areaPosition = {
        x: stageRect.x + textPosition.x * scaleX,
        y: stageRect.y + textPosition.y * scaleY,
      };

      textarea.value = textValue;
      textarea.style.position = "absolute";
      textarea.style.top = `${areaPosition.y}px`;
      textarea.style.left = `${areaPosition.x}px`;
      textarea.style.width =
        shapeRef.current.width() * shapeRef.current.scaleX() * scaleX -
        shapeRef.current.padding() * 2 +
        "px";
      textarea.style.height =
        shapeRef.current.height() * shapeRef.current.scaleY() * scaleY -
        shapeRef.current.padding() * 2 +
        "px";
      textarea.style.fontSize =
        shapeRef.current.fontSize() * shapeRef.current.scaleX() * scaleX + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = shapeRef.current.lineHeight();
      textarea.style.fontFamily = shapeRef.current.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = shapeRef.current.align();
      textarea.style.color = shapeRef.current.fill();

      textarea.focus();

      const removeTextarea = () => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
          node.show();
          transformer.show();
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          setTextValue(textarea.value);
          dispatch(
            updateLayer({
              id: selectedLayer.id,
              data: { text: textarea.value },
            })
          );
          removeTextarea();
          setIsEditing(false);
        }
        if (e.key === "Escape") {
          removeTextarea();
          setIsEditing(false);
        }
      };

      const handleOutsideClick = (e) => {
        if (!textarea.contains(e.target)) {
          setTextValue(textarea.value);
          removeTextarea();
          setIsEditing(false);
          dispatch(
            updateLayer({
              id: selectedLayer.id,
              data: { text: textarea.value },
            })
          );
        }
      };

      textarea.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", handleOutsideClick);

      return () => {
        textarea.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", handleOutsideClick);
      };
    }, 0);
  };

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
    const tr = trRef.current;
    if (tr) {
      tr.setNode(shapeRef.current);
      tr.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    setLocalIsSelected(isSelected || isSelectedFromToolbox);
    if (previousZIndex !== null) {
      shapeRef.current.setZIndex(previousZIndex);
      setPreviousZIndex(null);
    }
  }, [isSelected, isSelectedFromToolbox]);

  const handleSelect = (e) => {
    if (lock) return;
    onSelect(e);
    setLocalIsSelected(true);
  };

  const formatText = (text) => {
    // Thay thế các thẻ <br /> và <br> bằng ký tự xuống dòng
    const newText = text.replace(/<br\s*\/?>/gi, "\n");
    if (uppercase === 'uppercase') {
      return newText.toUpperCase();
    }
    return newText
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

  const [previousZIndex, setPreviousZIndex] = useState(null);

  useEffect(() => {
    if (shapeRef.current && trRef.current) {
      if (localIsSelected) {
        // Lưu trữ zIndex ban đầu trước khi di chuyển lên trên cùng
        setPreviousZIndex(shapeRef.current.getZIndex());
        // Di chuyển layer lên trên cùng
        shapeRef.current.moveToTop();
        trRef.current.moveToTop();
      } else {
        // Trả layer về vị trí ban đầu khi không còn được chọn
        if (previousZIndex !== null) {
          shapeRef.current.setZIndex(previousZIndex);
          setPreviousZIndex(null); // Reset lại giá trị zIndex ban đầu
        }
      }
    }
  }, [localIsSelected]);

  const giandongToPx = (giandong) => {
    if (typeof giandong === "string" && giandong.endsWith("vh")) {
      const vhValue = parseFloat(giandong);
      if (!isNaN(vhValue)) {
        const lineHeightInPx = (vhValue / 100) * designSize.height; // Chuyển đổi từ vh sang px
        return lineHeightInPx;
      }
    }
  };
 const isGradientArrayCorrectFormat = (arr) => {
   // Kiểm tra nếu mảng có số lượng phần tử chia hết cho 2 và mỗi cặp có dạng [position, color]
   return (
     Array.isArray(arr) &&
     arr.length % 2 === 0 &&
     arr.every((_, i) =>
       i % 2 === 0 ? typeof arr[i] === "number" : typeof arr[i] === "string"
     )
   );
 };

 // Kiểm tra xem tất cả các giá trị màu trong gradient có giống nhau không
 const isSingleColorGradient = (arr) => {
   const colors = arr.filter((_, i) => i % 2 !== 0); // Lấy tất cả giá trị màu
   return new Set(colors).size === 1; // Kiểm tra xem có bao nhiêu màu khác nhau
 };

 const gradientArray = Array.isArray(gradient_color[0])
   ? gradient_color
   : isGradientArrayCorrectFormat(gradient_color) &&
     !isSingleColorGradient(gradient_color)
   ? gradient_color
   : gradient_color.reduce((acc, { position, color }) => {
       acc.push(position, color);
       return acc;
     }, []);

 // Trả về null nếu mảng gradient có cùng một màu
    const finalGradient = isSingleColorGradient(gradientArray)
      ? null
      : gradientArray;


 console.log(finalGradient);


  return (
    <>
      <Text
        ref={shapeRef}
        text={formatText(textValue)}
        x={positionX}
        y={positionY}
        draggable={!lock}
        visible={Boolean(status)}
        width={width}
        height={giandongToPx(sizeConvertToPx * giandong)}
        align={text_align}
        verticalAlign="middle"
        rotation={rotationValue}
        fontSize={sizeConvertToPx}
        fontFamily={data?.font}
        fontStyle={getFontStyle(indam, innghieng)}
        textDecoration={gachchan}
        letterSpacing={vwToLetterSpacing(gianchu)}
        lineHeight={giandongToLineHeight(giandong)}
        wrap="word"
        onClick={!lock ? handleSelect : null}
        onTap={!lock ? handleSelect : null}
        onDblClick={!lock ? handleDblClick : null}
        onDblTap={!lock ? handleDblClick : null}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        fill={finalGradient ? null : data?.color}
        fillLinearGradientStartPoint={
          finalGradient ? { x: 0, y: 0 } : undefined
        }
        fillLinearGradientEndPoint={
          finalGradient ? { x: width, y: sizeConvertToPx } : undefined
        }
        fillLinearGradientColorStops={
          finalGradient ? gradientArray : undefined
        }
      />

      {isTransformerVisible && !lock && localIsSelected && (
        <Transformer
          ref={trRef}
          node={shapeRef.current}
          anchorStyleFunc={(anchor) => {
            anchor.cornerRadius(10);
            if (
              anchor.hasName("top-left") ||
              anchor.hasName("top-right") ||
              anchor.hasName("bottom-left") ||
              anchor.hasName("bottom-right")
            ) {
              anchor.visible(false);
            }
            if (
              anchor.hasName("top-center") ||
              anchor.hasName("bottom-center")
            ) {
              anchor.visible(false);
            }
            if (
              anchor.hasName("middle-left") ||
              anchor.hasName("middle-right")
            ) {
              anchor.visible(true);
              anchor.height(30);
              anchor.offsetY(15);
              anchor.width(6);
              anchor.offsetX(3);
            }
          }}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.height = oldBox.height;
            if (Math.abs(newBox.width) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
