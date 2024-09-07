import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

const TransformerLayer = ({ shapeRef, id }) => {
  const trRef = useRef(null);

  useEffect(() => {
    if (trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [shapeRef, id]);

  if (!shapeRef?.current) {
    return null; // Do not render Transformer if shapeRef is not set
  }

  return (
    <Transformer
      ref={trRef}
      flipEnabled={false}
      anchorStyleFunc={(anchor) => {
        anchor.cornerRadius(10);
        if (anchor.hasName("top-center") || anchor.hasName("bottom-center")) {
          anchor.visible(false);
          anchor.height(6);
          anchor.offsetY(3);
          anchor.width(30);
          anchor.offsetX(15);
        }
        if (anchor.hasName("middle-left") || anchor.hasName("middle-right")) {
          anchor.visible(false);
          anchor.height(30);
          anchor.offsetY(15);
          anchor.width(6);
          anchor.offsetX(3);
        }
      }}
      boundBoxFunc={(oldBox, newBox) => {
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default TransformerLayer;
