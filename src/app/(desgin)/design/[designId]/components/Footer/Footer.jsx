import React, { useState, useRef } from "react";
import { useClickAway } from "react-use";
import LayerIcon from "../../Icon/Layer";
import Return from "../../Icon/Return";
import ZoomIn from "../../Icon/ZoomIn";
import ZoomOut from "../../Icon/ZoomOut";
import Minus from "../../Icon/Minus";
import Plus from "../../Icon/Plus";
import { Col, InputNumber, Row, Slider } from "antd";

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => {
    setVisible(false);
  });

  const [sliderValue, setSliderValue] = useState(1);
  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  }

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= 100) {
      setSliderValue(value);
    }
  };

  const handleMinusClick = () => {
    setSliderValue((prevValue) => Math.max(prevValue - 1, 0));
  };

  const handlePlusClick = () => {
    setSliderValue((prevValue) => Math.min(prevValue + 1, 100));
  };

  return (
    <div className="stick flex flex-row justify-between items-center h-[50px] border-l border-slate-300 px-5 bg-white">
      <div className="flex flex-row items-center">
        <LayerIcon size={20} />
        <p className="pl-2">Trang</p>
      </div>

      <div className="flex flex-row items-center justify-center">
        <div className="mx-2 cursor-pointer" ><ZoomOut size={20}/></div>
        <div className="mx-2 cursor-pointer" ><ZoomIn size={20}/></div>
        <div className="mx-2 cursor-pointer" onClick={handleMinusClick}><Minus size={20} /></div>
        {/* <Slider />
        <InputWithLabel /> */}
         <Row>
          <Col span={12}>
            <Slider
              min={1}
              max={100}
              onChange={handleSliderChange}
              value={sliderValue}
              dots={false}
              styles={"color: #3333"}
            />
          </Col>
          <div className="mx-2 py-2cursor-pointer" onClick={handlePlusClick}>
            <Plus size={20} />
          </div>
          <Col span={4}>
            <InputNumber
              min={1}
              max={100}
              style={{
                margin: '0 16px',
              }}
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
