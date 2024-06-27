"use client";
import React from "react";
import { Canvas } from "@layerhub-io/react";
import Playback from "../Playback";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { useActiveObject } from "@layerhub-io/react";
export default function CanvasComponent() {
  const activeObject = useActiveObject();
  const { displayPlayback } = useDesignEditorContext();
  const handleCtrlC = (event: any) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "c") {
      // Thực hiện các hành động khi người dùng nhấn "Ctrl + C"
      console.log(activeObject);
      return;
    } else if ((event.ctrlKey || event.metaKey) && event.key === "v") {
      console.log(activeObject);
      return;
    }
  };
  document.addEventListener("keydown", handleCtrlC);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        position: "relative",
        overflow: "auto",
      }}
    >
      {displayPlayback && <Playback />}
      <Canvas
        config={{
          background: "#f1f2f6",
          controlsPosition: {
            rotation: "BOTTOM",
          },
          // overflow: "visible" as any,
          shadow: {
            blur: 0.5,
            color: "#fcfcfc",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
    </div>
  );
}
