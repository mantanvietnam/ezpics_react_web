import React, { useState } from "react";
import LayerIcon from "../../Icon/Layer";
import TextIcon from "../../Icon/Text";
import PhotoIcon from "../../Icon/Photo";
import ElementIcon from "../../Icon/Element";
import CustomizeIcon from "../../Icon/Customize";
import Layer from "./Layer";
import Text from "./Text";
import Photos from "./Photos";
import Element from "./Element";
import Customize from "./Customize";

const Toolbox = () => {
  const [activeTool, setActiveTool] = useState("Layer");

  const handleToolClick = (tool) => {
    setActiveTool(tool === activeTool ? null : tool);
  };

  const toolStyle = (tool) => ({
    backgroundColor: activeTool === tool ? "#d0e5f2" : "transparent",
  });

  return (
    <>
      <div
        style={{
          height: "100%",
          position: "fixed",
          zIndex: "5",
        }}>
        <div
          style={{
            width: "96px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ccc",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "20px 10px",
              ...toolStyle("Layer"),
            }}
            onClick={() => handleToolClick("Layer")}>
            <LayerIcon size={20} />
            <p>Layer</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "20px 10px",
              ...toolStyle("Text"),
            }}
            onClick={() => handleToolClick("Text")}>
            <TextIcon size={20} />
            <p>Text</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "20px 10px",
              ...toolStyle("Photos"),
            }}
            onClick={() => handleToolClick("Photos")}>
            <PhotoIcon size={20} />
            <p>Photos</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "20px 10px",
              ...toolStyle("Element"),
            }}
            onClick={() => handleToolClick("Element")}>
            <ElementIcon size={20} />
            <p>Element</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "20px 10px",
              ...toolStyle("Customize"),
            }}
            onClick={() => handleToolClick("Customize")}>
            <CustomizeIcon size={20} />
            <p>Customize</p>
          </div>
        </div>
        <div>
          {activeTool === "Layer" && <Layer />}
          {activeTool === "Text" && <Text />}
          {activeTool === "Photos" && <Photos />}
          {activeTool === "Element" && <Element />}
          {activeTool === "Customize" && <Customize />}
        </div>
      </div>
    </>
  );
};

export default Toolbox;
