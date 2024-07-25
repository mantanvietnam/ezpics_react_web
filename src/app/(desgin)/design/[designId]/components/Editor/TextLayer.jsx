import { updateLayer } from "@/redux/slices/editor/stageSlice";
import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { useDispatch } from "react-redux";

export default function TextLayer(props) {
  const { data, designSize, isSelected, onSelect, onTextChange, id } = props;
  const { postion_left, postion_top, size, indam, ing } = data;

  // console.log(indam);

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

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

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
    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
    };
    dispatch(updateLayer({ id: id, data: data }));
  };

  const handleTransformEnd = (e) => {
    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
      width: `${
        ((e.target.width() * e.target.scaleX()) / designSize.width) * 100
      }vw`,
      rotate: `${e.target.rotation()}deg`,
    };
    dispatch(updateLayer({ id: id, data: data }));
    e.target.scaleX(1);
    e.target.scaleY(1);
  };

  const handleDblClick = () => {
    setIsEditing(true);

    const textPosition = shapeRef.current.absolutePosition();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textValue;
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y + offsetY}px`;
    textarea.style.left = `${textPosition.x + offsetX}px`;
    textarea.style.width =
      shapeRef.current.width() - shapeRef.current.padding() * 2 + "px";
    textarea.style.height =
      shapeRef.current.height() - shapeRef.current.padding() * 2 + "px";
    textarea.style.fontSize = shapeRef.current.fontSize() + "px";
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

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        setTextValue(textarea.value);
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
      }
      if (e.key === "Escape") {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
      }
    });

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        setTextValue(textarea.value);
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
      }
    };

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  return (
    <>
      <Text
        ref={shapeRef}
        text={textValue}
        x={positionX}
        y={positionY}
        draggable
        fill={data?.color}
        fontSize={sizeConvertToPx}
        fontStyle={indam}
        fontFamily={data?.font}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorStyleFunc={(anchor) => {
            anchor.cornerRadius(10);
            // Hide anchors for height adjustment
            if (
              anchor.hasName("top-left") ||
              anchor.hasName("top-right") ||
              anchor.hasName("bottom-left") ||
              anchor.hasName("bottom-right")
            ) {
              anchor.visible(false);
            }
            // Hide anchors for height adjustment
            if (
              anchor.hasName("top-center") ||
              anchor.hasName("bottom-center")
            ) {
              anchor.visible(false);
            }
            // Show anchors for width adjustment
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
            // Limit resize to width only
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
