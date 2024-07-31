import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

export default function TextLayer(props) {
  const {
    data,
    designSize,
    isSelected,
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
  } = data;

  const getScaleFromTransform = (transformString) => {
    const regex = /scale\(([^)]+)\)/;
    const match = transformString.match(regex);

    if (match) {
      const scale = parseFloat(match[1]);
      return { scaleX: scale, scaleY: scale }; // Assuming uniform scaling
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

  // Position of the text
  const positionX = designSize.width * (postion_left / 100);
  const positionY = designSize.height * (postion_top / 100);

  // Convert vw to px
  const sizeValue = parseFloat(size?.replace("vw", ""));
  const sizeConvertToPx = designSize.width * (sizeValue / 100);

  //wid
  const widthValue = parseFloat(
    typeof data.width === "string" ? data.width.replace("vw", "") : data.width
  );
  const width = designSize.width * (widthValue / 100);

  // Rotation
  const rotationValue = parseFloat(rotate?.replace("deg", ""));

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

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
  };

  const handleTransform = (e) => {
    const node = shapeRef.current;
    const newScaleX = node.scaleX();
    const newScaleY = node.scaleY();
    // If dragging sides, change width only
    const newWidth = node.width() * newScaleX;
    node.width(newWidth);
    node.scaleX(1);
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
  };

  const handleDblClick = () => {
    if (lock) return; // Prevent editing if locked

    // console.log("Double clicked"); // Debugging log

    setIsEditing(true);

    setTimeout(() => {
      // const textPosition = shapeRef.current.getClientRect();
      const node = shapeRef.current;
      const transformer = trRef.current;

      // Ẩn textNode và transformer
      node.hide();
      transformer.hide();

      // Tạo textarea
      const textarea = document.createElement("textarea");
      textareaRef.current = textarea; // Store textarea reference
      document.body.appendChild(textarea);

      // console.log("Textarea created"); // Debugging log
      const textPosition = node.getClientRect();
      const stageContainer = stageRef.current.container();
      const stageRect = stageContainer.getBoundingClientRect();
      const areaPosition = {
        x: stageRect.x + textPosition.x * scaleX,
        y: stageRect.y + textPosition.y * scaleY,
      };

      console.log("stageRect", stageRect);
      console.log("textPosition", textPosition);

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

      console.log("Textarea position:", {
        top: textarea.style.top,
        left: textarea.style.left,
        width: textarea.style.width,
        height: textarea.style.height,
      });

      const removeTextarea = () => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
          node.show();
          transformer.show();
          // console.log("Textarea removed"); // Debugging log
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
        }
      };

      textarea.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", handleOutsideClick);

      // Clean up event listeners when the component unmounts or when editing state changes
      return () => {
        textarea.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", handleOutsideClick);
      };
    }, 0); // Use a timeout to ensure the textarea is added before other operations
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

  return (
    <>
      <Text
        ref={shapeRef}
        text={textValue}
        x={positionX}
        y={positionY}
        draggable={!lock}
        visible={Boolean(status)}
        fill={data?.color}
        width={width}
        align={text_align}
        rotation={rotationValue}
        fontSize={sizeConvertToPx}
        fontFamily={data?.font}
        fontStyle={getFontStyle(indam, innghieng)}
        textDecoration={gachchan}
        letterSpacing={gianchu === "normal" ? 0 : parseFloat(gianchu)}
        lineHeight={giandong === "normal" ? 1 : parseFloat(giandong)}
        onClick={!lock ? onSelect : null}
        onTap={!lock ? onSelect : null}
        onDblClick={!lock ? handleDblClick : null}
        onDblTap={!lock ? handleDblClick : null}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && isTransformerVisible && !lock && (
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
