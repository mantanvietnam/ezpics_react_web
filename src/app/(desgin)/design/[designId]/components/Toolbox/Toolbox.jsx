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
import { LeftOutlined } from "@ant-design/icons";

const Toolbox = ({ onToolChange, stageRef }) => {
  console.log('🚀 ~ Toolbox ~ stageRef:', stageRef)
  const [isToolboxVisible, setIsToolboxVisible] = useState(true);
  const [activeTool, setActiveTool] = useState("Layer")

  const handleToolClick = (tool) => {
    const newActiveTool = tool === activeTool ? null : tool;
    setActiveTool(newActiveTool);
    onToolChange(newActiveTool);
    setIsToolboxVisible(true);
  };

  const toolStyle = (tool) => ({
    backgroundColor: activeTool === tool ? "#fff" : "transparent",
    color: activeTool === tool ? "#000" : "#fff",
  });

  console.log(isToolboxVisible);
  return (
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
          backgroundColor: "#000",
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
          onClick={() => {
            handleToolClick("Layer");
            if (activeTool === "Layer") {
              setIsToolboxVisible(false);
            }
          }}>
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
          onClick={() => {
            handleToolClick("Text");
            if (activeTool === "Text") {
              setIsToolboxVisible(false);
            }
          }}>
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
          onClick={() => {
            handleToolClick("Photos");
            if (activeTool === "Photos") {
              setIsToolboxVisible(false);
            }
          }}>
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
          onClick={() => {
            handleToolClick("Element");
            if (activeTool === "Element") {
              setIsToolboxVisible(false);
            }
          }}>
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
          onClick={() => {
            handleToolClick("Customize");
            if (activeTool === "Customize") {
              setIsToolboxVisible(false);
            }
          }}>
          <CustomizeIcon size={20} />
          <p>Customize</p>
        </div>
      </div>

      <div
        className={`absolute z-1 top-[44%] cursor-pointer w-[28px] bg-white h-[60px] flex transition-all duration-300 ${isToolboxVisible ? "opacity-100 left-[396px]" : "opacity-0 left-0"
          }`}
        style={{
          clipPath: "ellipse(66% 50% at 0% 50%)",
        }}>
        <button
          onClick={() => {
            setIsToolboxVisible(!isToolboxVisible);
            onToolChange(null);
            setActiveTool(null);
          }}>
          <LeftOutlined />
        </button>
      </div>

      {activeTool === "Layer" && <Layer />}
      {activeTool === "Text" && <Text />}
      {activeTool === "Photos" && <Photos />}
      {activeTool === "Element" && <Element />}
      {activeTool === "Customize" && <Customize />}
    </div>
  );
};

export default Toolbox;
