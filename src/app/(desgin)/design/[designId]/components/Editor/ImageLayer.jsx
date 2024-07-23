import React, { useEffect, useRef, useState } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva"; // Đảm bảo import Konva
import { useDispatch } from "react-redux";
import { updateLayer } from '@/redux/slices/editor/stageSlice';

export default function ImageLayer(props) {
  const { data, designSize, id, isSelected, onSelect } = props;
  const { postion_left, postion_top, naturalHeight, naturalWidth, rotate, opacity, brightness } = data;

  const dispatch = useDispatch();
  const shapeRef = useRef();
  const trRef = useRef();
  const brightnessRef = useRef(brightness);
  const [image] = useImage(data.banner);
  console.log('🚀 ~ ImageLayer ~ image:', image)

  // Chuyển đổi đơn vị vw vh sang px
  const widthValue = parseFloat(data.width?.replace("vw", ""));
  const width = designSize.width * (widthValue / 100);
  const heightSize = (naturalHeight * width) / naturalWidth;

  // Vị trí của chúng
  const postionX = designSize.width * (postion_left / 100);
  const postionY = designSize.height * (postion_top / 100);

  // Rotation
  const rotation = parseFloat(rotate?.replace("deg", ""));

  // Độ sáng
  // useEffect(() => {
  //   if (shapeRef.current && brightness !== undefined) {
  //     shapeRef.current.cache();
  //     shapeRef.current.filters([Konva.Filters.Brighten]);
  //     shapeRef.current.brightness(brightness / 100 - 1 || 0); // Đặt độ sáng
  //     shapeRef.current.getLayer().batchDraw();
  //     console.log('🚀 ~ useEffect ~ brightness / 100:', brightness / 100 - 1)
  //   }
  // }, [image, brightness]);

  // Hiển thị transform thủ công
  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

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
      width: `${(e.target.width() * e.target.scaleX()) * 100 / designSize.width}vw`,
      rotate: `${e.target.rotation()}deg`,
    };
    dispatch(updateLayer({ id: id, data: data }));
    e.target.scaleX(1);
    e.target.scaleY(1);
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
        height={heightSize}
        rotation={rotation}
        opacity={opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          anchorStyleFunc={(anchor) => {
            anchor.cornerRadius(10);
            if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
              anchor.height(6);
              anchor.offsetY(3);
              anchor.width(30);
              anchor.offsetX(15);
            }
            if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
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
        />
      )}
    </>
  );
}
