import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button, Dropdown, Menu, Slider } from "antd";
import { useClickAway } from "react-use";

const SliderMenu = ({
  onChangeBrightness,
  onChangeOpacity,
  onChangeContrast,
  onChangeSaturate,
}) => (
  <Menu className="w-[250px]">
    <Menu.Item key="slider1">
      <span>Độ sáng</span>
      <Slider onChange={onChangeBrightness} />
    </Menu.Item>
    <Menu.Item key="slider2">
      <span>Độ trong</span>
      <Slider onChange={onChangeOpacity} />
    </Menu.Item>
    <Menu.Item key="slider3">
      <span>Độ tương phản</span>
      <Slider onChange={onChangeContrast} />
    </Menu.Item>
    <Menu.Item key="slider3">
      <span>Độ bão hòa</span>
      <Slider onChange={onChangeSaturate} />
    </Menu.Item>
  </Menu>
);

const PanelsImage = () => {
  //State độ sáng
  const [valueBrightness, setValueBrightness] = useState(0);
  const handleSliderBrightness = (newValue) => {
    setValueBrightness(newValue);
  };

  //State độ trong
  const [valueOpacity, setValueOpacity] = useState(0);
  const handleSliderOpacity = (newValue) => {
    setValueOpacity(newValue);
  };

  //State độ tương phản
  const [valueContrast, setValueContrast] = useState(0);
  const handleSliderContrast = (newValue) => {
    setValueContrast(newValue);
  };

  //State độ bão hòa
  const [valueSaturate, setValueSaturate] = useState(0);
  const handleSliderSaturate = (newValue) => {
    setValueSaturate(newValue);
  };

  //State khi ấn blur ra ngoài mới ẩn dropdown edit image
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => {
    setVisible(false);
  });
  const handleButtonClick = () => {
    setVisible(!visible);
  };

  useClickAway(dropdownRef, () => {
    setVisible(false);
  });

  return (
    <div className="stick  h-[50px] border-l border-slate-300">
      <div className="h-[100%] flex items-center">
        <div className="px-1">
          <Button type="text" className="text-lg font-bold">
            Lật ảnh ngang
          </Button>
        </div>
        <div className="px-1">
          <Button type="text" className="text-lg font-bold">
            Lật ảnh dọc
          </Button>
        </div>
        <div className="px-1">
          <Button type="text" className="text-lg font-bold gap-0">
            Xóa nền
            <Image
              src="/assets/premium.png"
              style={{
                resize: "block",
                marginBottom: "20%",
                marginLeft: "3",
              }}
              width={15}
              height={15}
              alt=""
            />
          </Button>
        </div>

        <div className="px-1" ref={dropdownRef}>
          <Button onClick={handleButtonClick}>Chỉnh sửa ảnh</Button>
          {visible && (
            <Dropdown
              overlay={
                <SliderMenu
                  onChangeBrightness={handleSliderBrightness}
                  onChangeOpacity={handleSliderOpacity}
                  onChangeContrast={handleSliderContrast}
                  onChangeSaturate={handleSliderSaturate}
                />
              }
              visible={true}>
              <div />
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelsImage;
