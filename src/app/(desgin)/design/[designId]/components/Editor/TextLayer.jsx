import { updateLayer } from '@/redux/slices/editor/stageSlice'
import React, { useEffect, useRef } from 'react'
import { Text, Transformer } from 'react-konva'
import { useDispatch } from 'react-redux'

export default function TextLayer(props) {
  const { data, designSize, id, isSelected, onSelect } = props
  const { postion_left, postion_top, size } = data
  console.log('🚀 ~ TextLayer ~ size:', size)

  const dispatch = useDispatch()
  const shapeRef = useRef()
  const trRef = useRef()

  //Chuyển đởi đơn vị vw vh sang px
  const widthValue = parseFloat(data.width?.replace("vw", ""))
  const width = designSize.width * (widthValue / 100)

  //Vị trí của chúng
  const postionX = designSize.width * (postion_left / 100);
  const postionY = designSize.height * (postion_top / 100);

  //Chuyển đởi đơn vị vw vh sang px
  const sizeValue = parseFloat(size?.replace("px", ""));
  const sizeConvertToPx = designSize.width * (sizeValue / 100);

  //Hiển thị transform thủ công
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
    }
    dispatch(updateLayer({ id: id, data: data }))
  }

  const handleTransformEnd = (e) => {
    console.log("--------------------------------22222222222222", {
      id,
      width: e.target.width() * e.target.scaleX(),
      height: e.target.height() * e.target.scaleY(),
      rotation: e.target.rotation(),
      newWidth: `${((e.target.width() * e.target.scaleX()) / designSize.width) * 100}vw`
    })
    const data = {
      postion_left: (e.target.x() / designSize.width) * 100,
      postion_top: (e.target.y() / designSize.height) * 100,
      width: `${((e.target.width() * e.target.scaleX()) / designSize.width) * 100}vw`,
      rotate: `${e.target.rotation()}deg`
    }
    dispatch(updateLayer({ id: id, data: data }))
    e.target.scaleX(1);
    e.target.scaleY(1);
  }

  return (
    <>
      <Text
        ref={shapeRef}
        text={data?.text}
        x={postionX}
        y={postionY}
        draggable
        fill={data?.color}
        fontSize={sizeConvertToPx}
        width={width}
        fontFamily={data?.font}
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
            // you also can set other properties
            // e.g. you can set fillPatternImage to set icon to the anchor
          }}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  )
}
