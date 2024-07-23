import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button, Slider, Popover } from "antd";
import { useClickAway } from "react-use";
import PanelsCommon from "./PanelsCommon";

const SliderMenu = ({
  onChangeBrightness,
  onChangeOpacity,
  onChangeContrast,
  onChangeSaturate,
}) => (
  <div className="w-[250px]">
    <div className="p-2">
      <span>Độ sáng</span>
      <Slider onChange={onChangeBrightness} />
    </div>
    <div className="p-2">
      <span>Độ trong</span>
      <Slider onChange={onChangeOpacity} />
    </div>
    <div className="p-2">
      <span>Độ tương phản</span>
      <Slider onChange={onChangeContrast} />
    </div>
    <div className="p-2">
      <span>Độ bão hòa</span>
      <Slider onChange={onChangeSaturate} />
    </div>
  </div>
);

const ButtonMenu = ({ onButtonChangeImageNew, onButtonChangeImage }) => (
  <div className="flex">
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={onButtonChangeImageNew}>
      Thay ảnh từ máy
    </Button>
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={onButtonChangeImage}>
      Thay ảnh có sẵn
    </Button>
  </div>
);

const PanelsImage = () => {
  // States for sliders
  const [valueBrightness, setValueBrightness] = useState(0);
  const [valueOpacity, setValueOpacity] = useState(0);
  const [valueContrast, setValueContrast] = useState(0);
  const [valueSaturate, setValueSaturate] = useState(0);

  // States for popover visibility
  const [visibleEditImage, setVisibleEditImage] = useState(false);
  const [visibleChangeImage, setVisibleChangeImage] = useState(false);

  // Refs for popovers
  const popoverRefEditImage = useRef(null);
  const popoverRefChangeImage = useRef(null);

  // Handlers for sliders
  const handleSliderBrightness = (newValue) => {
    setValueBrightness(newValue);
  };

  const handleSliderOpacity = (newValue) => {
    setValueOpacity(newValue);
  };

  const handleSliderContrast = (newValue) => {
    setValueContrast(newValue);
  };

  const handleSliderSaturate = (newValue) => {
    setValueSaturate(newValue);
  };

  // Handlers for popovers
  const handleButtonEditImage = () => {
    setVisibleEditImage(!visibleEditImage);
  };

  const handleButtonImage = () => {
    setVisibleChangeImage(!visibleChangeImage);
  };

  const handleButtonChangeImageNew = () => {
    console.log("Button 1 clicked");
    setVisibleChangeImage(false);
  };

  const handleButtonChangeImage = () => {
    console.log("Button 2 clicked");
    setVisibleChangeImage(false);
  };

  // Click away handlers
  useClickAway(popoverRefEditImage, () => {
    if (visibleEditImage) {
      setVisibleEditImage(false);
    }
  });

  useClickAway(popoverRefChangeImage, () => {
    if (visibleChangeImage) {
      setVisibleChangeImage(false);
    }
  });

  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <h2>PanelText</h2>

        <div>
          <PanelsCommon />
        </div>
      </div>
    </div>
  );
};

export default PanelsImage;
