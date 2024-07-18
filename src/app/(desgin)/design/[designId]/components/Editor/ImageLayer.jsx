import React, { useEffect, useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

export default function ImageLayer(props) {
  const { data, designSize } = props;
  const { postion_left, postion_top, naturalHeight, naturalWidth } = data;
  console.log("🚀 ~ ImageLayer ~ postion_top:", postion_top);
  console.log("🚀 ~ ImageLayer ~ postion_left:", postion_left);
  console.log("🚀 ~ ImageLayer ~ data:", data);
  const [image] = useImage(data.banner);

  //Chuyển đởi đơn vị vw vh sang px
  const widthValue = parseFloat(data.width?.replace("vw", ""));
  const width = designSize.width * (widthValue / 100);

  const heightSize = (naturalHeight * width) / naturalWidth;
  // const heightValue = parseFloat(data.height?.replace('vh', ''));
  // const height = designSize.height * (heightValue / 100)

  //Vị trí của chúng
  const postionX = designSize.width * (postion_left / 100);
  const postionY = designSize.height * (postion_top / 100);
  // const heightValue = parseFloat(data.height?.replace('vh', ''));
  // const height = designSize.height * (heightValue / 100)

  return (
    <Image
      image={image}
      alt="background"
      x={postionX}
      y={postionY}
      width={width}
      height={heightSize}
      draggable
    />
  );
}
