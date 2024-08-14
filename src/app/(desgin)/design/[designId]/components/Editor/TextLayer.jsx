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
  const positionY = designSize.height * (postion_top / 100) + 12;

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

    // Mark as selected when dragging ends
    setLocalIsSelected(true);
  };

  const handleTransform = (e) => {
    const node = shapeRef.current;
    const newScaleX = node.scaleX();
    const newScaleY = node.scaleY();
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
  }, [isSelected, isSelectedFromToolbox]);

  const handleClickOutside = useCallback(
    (e) => {
      if (containerRef.current && shapeRef.current) {
        // Lấy tọa độ click
        const { clientX: clickX, clientY: clickY } = e;

        // Tính toán kích thước và vị trí của container
        const containerRect = containerRef.current.getBoundingClientRect();
        const layerRect = shapeRef.current.getClientRect();

        // Kiểm tra nếu click nằm trong containerRef và ngoài shapeRef
        const clickInsideContainer =
          clickX >= containerRect.left &&
          clickX <= containerRect.right &&
          clickY >= containerRect.top &&
          clickY <= containerRect.bottom;

        const clickOutsideLayer = !(
          clickX >= layerRect.left &&
          clickX <= layerRect.right &&
          clickY >= layerRect.top &&
          clickY <= layerRect.bottom
        );
        // Kích hoạt khi click nằm ngoài container và ngoài layer
        if (clickInsideContainer && clickOutsideLayer) {
          setLocalIsSelected(false);
          // dispatch(deselectLayerTool());
        }
      }
    },
    [dispatch, containerRef, shapeRef]
  );

  const handleSelect = (e) => {
    console.log("click inside");
    if (lock) return;
    onSelect(e);
    setLocalIsSelected(true);
    // dispatch(selectLayerTool({ id })); // Dispatch action to select layer
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const formatText = (text) => {
    // Thay thế các thẻ <br /> và <br> bằng ký tự xuống dòng
    return text.replace(/<br\s*\/?>/gi, "\n");
  };

  return (
    <>
      <Text
        ref={shapeRef}
        text={formatText(textValue)}
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
        lineHeight={
          giandong === "0.0vh"
            ? 1
            : giandong === "normal"
              ? 1
              : parseFloat(giandong)
        }
        ellipsis
        onClick={!lock ? handleSelect : null}
        onTap={!lock ? handleSelect : null}
        onDblClick={!lock ? handleDblClick : null}
        onDblTap={!lock ? handleDblClick : null}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
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
