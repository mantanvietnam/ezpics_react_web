import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

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
    text_align
  } = data;

  const dispatch = useDispatch();

  const { selectedLayer } = useSelector((state) => state.stage.stageData)

  const shapeRef = useRef();
  const trRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(data?.text);
  const [localIsSelected, setLocalIsSelected] = useState(false);

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

  //Vẽ ra transform
  useEffect(() => {
    if (localIsSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [localIsSelected]);

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (e) => {
        if (e.target.tagName !== "TEXTAREA") {
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
      width: `${((node.width() * node.scaleX()) / designSize.width) * 100
        }vw`
    };
    dispatch(updateLayer({ id, data }));
    e.target.scaleX(1);
    e.target.scaleY(1);
  };

  const handleDblClick = () => {
    if (lock) return; // Prevent editing if locked

    setIsEditing(true);

    const textPosition = shapeRef.current.getClientRect();
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textValue;
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y}px`;
    textarea.style.left = `${textPosition.x}px`;
    textarea.style.width =
      shapeRef.current.width() * shapeRef.current.scaleX() - shapeRef.current.padding() * 2 + "px";
    textarea.style.height =
      shapeRef.current.height() * shapeRef.current.scaleY() - shapeRef.current.padding() * 2 + "px";
    textarea.style.fontSize = shapeRef.current.fontSize() * shapeRef.current.scaleX() + "px";
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

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        setTextValue(textarea.value);
        document.body.removeChild(textarea);
        dispatch(updateLayer({ id: selectedLayer.id, data: { text: textarea.value } }))
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
      }
      if (e.key === "Escape") {
        document.body.removeChild(textarea);
        setIsEditing(false);
      }
    };

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        setTextValue(textarea.value);
        document.body.removeChild(textarea);
        setIsEditing(false);
      }
    };

    textarea.addEventListener("keydown", handleKeyDown);
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
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
        onClick={!lock ? onSelect : null}
        onTap={!lock ? onSelect : null}
        onDblClick={!lock ? handleDblClick : null}
        onDblTap={!lock ? handleDblClick : null}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
      />
      {(isTransformerVisible && !lock && localIsSelected) && (
        <Transformer
          ref={trRef}
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
