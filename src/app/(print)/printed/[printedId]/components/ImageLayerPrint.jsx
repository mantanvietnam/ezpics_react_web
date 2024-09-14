import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { useDispatch } from "react-redux";
import {
  updateLayer,
  moveLayerToFinal,
  moveLayerToFront,
} from "@/redux/slices/print/printSlice";
import Konva from "konva";

export default function ImageLayer(props) {
  const { data, designSize, id, isSelected } = props;
  const {
    postion_left,
    postion_top,
    naturalHeight,
    naturalWidth,
    rotate,
    scaleX,
    scaleY,
    opacity,
  } = data;

  const dispatch = useDispatch();

  const shapeRef = useRef();

  const [image] = useImage(data.banner, "anonymous");

  // Convert vw to px
  // const widthValue = parseFloat(data.width ? data.width.replace("vw", "") : 0);
  const widthValue = parseFloat(
    typeof data.width === "string" ? data.width.replace("vw", "") : data.width
  );
  const width = designSize.width * (widthValue / 100);

  const height = (naturalHeight * width) / naturalWidth;

  // Position
  const postionX = designSize.width * (postion_left / 100);
  const postionY = designSize.height * (postion_top / 100);

  // Rotation
  const rotation = parseFloat(rotate?.replace("deg", ""));

  const handleDragEnd = (e) => {
    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
    };
    dispatch(updateLayer({ id: id, data: data }));

    dispatch(moveLayerToFinal({ id: id }));
  };

  const handleDragMove = (e) => {
    dispatch(moveLayerToFront({ id: id }));
  };

  return (
    <>
      <Image
        ref={shapeRef}
        id={id}
        image={image}
        alt="layer"
        x={postionX}
        y={postionY}
        width={width}
        height={height}
        rotation={rotation}
        scaleX={scaleX}
        scaleY={scaleY}
        draggable={isSelected ? true : false}
        opacity={opacity}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      />
    </>
  );
}
