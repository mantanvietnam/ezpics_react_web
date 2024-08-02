import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import Konva from "konva";
import GuideLines from './GuideLines'

export default function ImageLayer(props) {
  const {
    data,
    designSize,
    id,
    isSelected,
    isSelectedFromToolbox,
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
  const [image] = useImage(data.banner, "anonymous");
  const [isSelectLayer, setIsSelectLayer] = useState(isSelected);
  const [localIsSelected, setLocalIsSelected] = useState(false);
  const [showLine, setShowLine] = useState(false)

  useEffect(() => {
    if (shapeRef.current && image) {
      // Đảm bảo hình ảnh đã được tải
      if (image.width > 0 && image.height > 0) {
        shapeRef.current.cache();
        shapeRef.current.getLayer().batchDraw();
      } else {
        console.error("Hình ảnh không hợp lệ.");
      }
    }
  }, [image]);

  // Convert vw to px
  // const widthValue = parseFloat(data.width ? data.width.replace("vw", "") : 0);
  const widthValue = parseFloat(
    typeof data.width === "string" ? data.width.replace("vw", "") : data.width
  );
  const width = designSize.width * (widthValue / 100);
  const heightSize = useMemo(
    () => (naturalHeight * width) / naturalWidth,
    [naturalHeight, naturalWidth, width]
  );
  const postionX = useMemo(
    () => designSize.width * (postion_left / 100),
    [designSize.width, postion_left]
  );
  const postionY = useMemo(
    () => designSize.height * (postion_top / 100),
    [designSize.height, postion_top]
  );
  const rotation = useMemo(
    () => parseFloat(rotate?.replace("deg", "")),
    [rotate]
  );
  const maxPositionLeft = useMemo(
    () => ((designSize.width - width) / designSize.width) * 100,
    [designSize.width, width]
  );
  const maxPositionTop = useMemo(
    () => ((designSize.height - heightSize) / designSize.height) * 100,
    [designSize.height, heightSize]
  );
  const centerLeft = useMemo(
    () => (designSize.width - width) / 2,
    [designSize.width, width]
  );
  const centerTop = useMemo(
    () => (designSize.height - heightSize) / 2,
    [designSize.height, heightSize]
  );
  const centerPositionX = useMemo(
    () => (centerLeft / designSize.width) * 100,
    [centerLeft, designSize.width]
  );
  const centerPositionY = useMemo(
    () => (centerTop / designSize.height) * 100,
    [centerTop, designSize.height]
  );

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

  //Vẽ ra transform
  useEffect(() => {
    if (localIsSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [localIsSelected]);

  useEffect(() => {
    if (shapeRef.current && image && image.width > 0 && image.height > 0) {
      shapeRef.current.cache();
      shapeRef.current.filters([Konva.Filters.Brighten]);
      shapeRef.current.brightness(brightness / 100 - 1);
      shapeRef.current.getLayer().batchDraw();
    }
  }, [brightness, image]);

  useEffect(() => {
    if (shapeRef.current && image && image.width > 0 && image.height > 0) {
      shapeRef.current.cache();
      shapeRef.current.filters([Konva.Filters.Contrast]);
      shapeRef.current.contrast(contrast - 100);
      shapeRef.current.getLayer().batchDraw();
    }
  }, [contrast, image]);

  useEffect(() => {
    if (shapeRef.current && image && image.width > 0 && image.height > 0) {
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
    if (lock) return; // Prevent dragging if locked

    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
    };
    dispatch(updateLayer({ id: id, data: data }));
    setShowLine(false)
  };

  const handleTransformEnd = (e) => {
    if (lock) return;

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
    setShowLine(false)
  };

  useEffect(() => {
    setIsSelectLayer(!lock && Boolean(status));
  }, [lock, status]);

  useEffect(() => {
    setLocalIsSelected(isSelected || isSelectedFromToolbox);
  }, [isSelected, isSelectedFromToolbox]);

  const [imageProps, setImageProps] = useState({
    x: useMemo(() => designSize.width * (postion_left / 100), [designSize.width, postion_left]),
    y: useMemo(() => designSize.height * (postion_top / 100), [designSize.height, postion_top]),
    width: useMemo(() => designSize.width * (parseFloat(data.width?.replace("vw", "") || 0) / 100), [designSize.width, data.width]),
    height: useMemo(() => (naturalHeight * width) / naturalWidth, [naturalHeight, naturalWidth, width]),
    rotation: useMemo(() => parseFloat(rotate?.replace("deg", "")), [rotate])
  });

  const handleDragMove = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    setImageProps(prev => ({ ...prev, x: newX, y: newY }));
    setShowLine(true);
  }

  return (
    <>
      <Image
        ref={shapeRef}
        id={id}
        image={image}
        alt="layer"
        x={postionX}
        y={postionY}
        width={width > 0 ? width : 200}
        height={heightSize > 0 ? heightSize : 200}
        opacity={opacity}
        rotation={rotation}
        scaleX={scaleX}
        scaleY={scaleY}
        draggable={!lock}
        visible={Boolean(status)}
        onClick={lock ? null : onSelect}
        onTap={lock ? null : onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onDragMove={handleDragMove}
      />
      {isTransformerVisible && !lock && localIsSelected && (
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
      {isTransformerVisible && !lock && showLine && (
        <GuideLines
          x={imageProps.x}
          y={imageProps.y}
          width={imageProps.width}
          height={imageProps.height}
          stageWidth={designSize.width}
          stageHeight={designSize.height}
        />
      )}
    </>
  );
}
