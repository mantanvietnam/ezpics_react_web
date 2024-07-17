import React, { useEffect, useState } from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'

export default function BackgroundLayer(props) {
  const { src } = props
  const [image] = useImage(src);
  return (
    <Image
      image={image}
      alt='background'
      x={0}
      y={0}
    />)
}
