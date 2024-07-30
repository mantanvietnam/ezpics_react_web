import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import Konva from "konva";

export default function ImageLayer(props) {
  const {
    data,
    designSize,
    id,
    isSelected,
    onSelect,
    onMaxPositionUpdate,
    isTransformerVisible,
  } = props;
  const {
    postion_left,
    postion_top,
    naturalHeight,
    naturalWidth,
    rotate,
    opacity,
    contrast,
    brightness,
    scaleX,
    scaleY,
    lock,
    status,
    saturate,
  } = data;

  const dispatch = useDispatch();

  const shapeRef = useRef();
  const trRef = useRef();

  // console.log("isTransformerVisible: ", isTransformerVisible);
  // console.log("isSelected: ", isSelected);

  const [image] = useImage(data.banner, "anonymous");

  const [isSelectLayer, setIsSelectLayer] = useState(isSelected);

  // Convert vw to px
  // const widthValue = parseFloat(data.width ? data.width.replace("vw", "") : 0);
  const widthValue = parseFloat(
    typeof data.width === "string" ? data.width.replace("vw", "") : data.width
  );
  const width = designSize.width * (widthValue / 100);

  const heightSize = (naturalHeight * width) / naturalWidth;

  // Position
  const postionX = designSize.width * (postion_left / 100);
  const postionY = designSize.height * (postion_top / 100);

  // Rotation
  const rotation = parseFloat(rotate?.replace("deg", ""));

  // Max X and Max Y
  const maxPositionLeft = ((designSize.width - width) / designSize.width) * 100;
  const maxPositionTop =
    ((designSize.height - heightSize) / designSize.height) * 100;

  const centerLeft = (designSize.width - width) / 2;
  const centerTop = (designSize.height - heightSize) / 2;

  // Convert center position to percentage
  const centerPositionX = (centerLeft / designSize.width) * 100;
  const centerPositionY = (centerTop / designSize.height) * 100;

  useEffect(() => {
    if (onMaxPositionUpdate) {
      onMaxPositionUpdate(
        maxPositionLeft,
        maxPositionTop,
        centerPositionX,
        centerPositionY
      );
    }
  }, [
    maxPositionLeft,
    maxPositionTop,
    centerPositionX,
    centerPositionY,
    onMaxPositionUpdate,
  ]);

  // Show transform manually
  useEffect(() => {
    if (isSelected) {
      // Attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Brightness
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.cache();
      shapeRef.current.filters([Konva.Filters.Brighten]);
      shapeRef.current.brightness(brightness / 100 - 1); // Set brightness
      shapeRef.current.getLayer().batchDraw();
    }
  }, [image, brightness]);

  // Contrast
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.cache();
      shapeRef.current.filters([Konva.Filters.Contrast]);
      shapeRef.current.contrast(contrast - 100);
      shapeRef.current.getLayer().batchDraw();
    }
  }, [contrast, image]);

  // Apply HSL filter
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.cache();
      shapeRef.current.filters([Konva.Filters.HSL]);
      shapeRef.current.saturation(saturate / 100 - 1);
      shapeRef.current.getLayer().batchDraw();
    }
  }, [saturate, image]);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.cache();
      shapeRef.current.getLayer().batchDraw();
    }
  }, [lock, postionX, postionY]);

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
      width: `${(e.target.width() * e.target.scaleX() * 100) / designSize.width
        }vw`,
      rotate: `${e.target.rotation()}deg`,
    };
    dispatch(updateLayer({ id: id, data: data }));
    e.target.scaleX(1);
    e.target.scaleY(1);
  };

  useEffect(() => {
    if (!lock == false || Boolean(status) == false) {
      setIsSelectLayer(true);
    } else {
      setIsSelectLayer(false);
    }
  }, [lock, status]);

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
        height={heightSize}
        opacity={opacity}
        rotation={rotation}
        scaleX={scaleX}
        scaleY={scaleY}
        draggable={!lock}
        visible={Boolean(status)}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && isTransformerVisible && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          anchorStyleFunc={(anchor) => {
            anchor.cornerRadius(10);
            if (
              anchor.hasName("top-center") ||
              anchor.hasName("bottom-center")
            ) {
              anchor.visible(false);
              anchor.height(6);
              anchor.offsetY(3);
              anchor.width(30);
              anchor.offsetX(15);
            }
            if (
              anchor.hasName("middle-left") ||
              anchor.hasName("middle-right")
            ) {
              anchor.visible(false);
              anchor.height(30);
              anchor.offsetY(15);
              anchor.width(6);
              anchor.offsetX(3);
            }
          }}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
          attachTo={shapeRef.current} // Gắn Transformer với đối tượng Image
        />
      )}
    </>
  );
}
