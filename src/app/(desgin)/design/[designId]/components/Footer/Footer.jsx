"use client"
import React, { useState, useRef, useEffect } from "react";
import LayerIcon from "../../Icon/Layer";
import Return from "../../Icon/Return";
import ZoomIn from "../../Icon/ZoomIn";
import ZoomOut from "../../Icon/ZoomOut";
import Minus from "../../Icon/Minus";
import Plus from "../../Icon/Plus";
import { Col, InputNumber, Row, Slider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setStageData } from "@/redux/slices/editor/stageSlice";

const scales = [5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];

const Footer = ({ containerRef }) => {
  const [currentScaleIdx, setCurrentScaleIdx] = useState(6); // Default index for scale 1
  const [sliderValue, setSliderValue] = useState(scales[currentScaleIdx]);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);

  const updateScale = (scale) => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.transform = `scale(${scale})`;
      container.style.transformOrigin = "center"; // Set transform origin to center
      dispatch(setStageData({ ...stageData, scale }));
    }
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    const newScaleIdx = scales.indexOf(value);
    if (newScaleIdx !== -1) {
      setCurrentScaleIdx(newScaleIdx);
      updateScale(value);
    }
  };

  const handleInputChange = (value) => {
    if (value >= 0.05 && value <= 5) {
      setSliderValue(value);
      const newScaleIdx = scales.indexOf(value);
      if (newScaleIdx !== -1) {
        setCurrentScaleIdx(newScaleIdx);
        updateScale(value);
      }
    }
  };

  const handleMinusClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.min(prevIdx + 1, scales.length - 1));
    const newScale = scales[Math.min(currentScaleIdx + 1, scales.length - 1)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handlePlusClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.max(prevIdx - 1, 0));
    const newScale = scales[Math.max(currentScaleIdx - 1, 0)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handleZoomInClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.max(prevIdx - 1, 0));
    const newScale = scales[Math.max(currentScaleIdx - 1, 0)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handleZoomOutClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.min(prevIdx + 1, scales.length - 1));
    const newScale = scales[Math.min(currentScaleIdx + 1, scales.length - 1)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  useEffect(() => {
    if (containerRef.current) {
      updateScale(scales[currentScaleIdx]);
    }
  }, [currentScaleIdx]);

  return (
    <div className="flex flex-row justify-between items-center h-[50px] border-l border-slate-300 px-5 bg-white">
      <div className="flex flex-row items-center">
        <LayerIcon size={20} />
        <p className="pl-2">Trang</p>
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="mx-2 cursor-pointer" onClick={handleZoomOutClick}>
          <ZoomOut size={20} />
        </div>
        <div className="mx-2 cursor-pointer" onClick={handleZoomInClick}>
          <ZoomIn size={20} />
        </div>
        <div className="mx-2 cursor-pointer" onClick={handleMinusClick}>
          <Minus size={20} />
        </div>
        <Row>
          <Col span={12}>
            <Slider
              min={0.05}
              max={5}
              step={0.05}
              onChange={handleSliderChange}
              value={sliderValue}
              open
            />
          </Col>
          <div className="mx-2 py-2 cursor-pointer" onClick={handlePlusClick}>
            <Plus size={20} />
          </div>
          <Col span={4}>
            <InputNumber
              min={0.05}
              max={5}
              step={0.05}
              style={{ margin: '0 16px' }}
              value={sliderValue}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
      </div>
      <div className="flex flex-row items-center">
        <Return size={20} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Footer;
