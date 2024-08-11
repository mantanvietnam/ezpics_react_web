import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/print/printSlice";
import Konva from "konva";

export default function ImageLayer(props) {
  const { data, designSize, id, onMaxPositionUpdate } = props;
  const {
    postion_left,
    postion_top,
    naturalHeight,
    naturalWidth,
    rotate,
    scaleX,
    scaleY,
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

  //   console.log("image", image);

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
        draggable={false}
      />
    </>
  );
}
