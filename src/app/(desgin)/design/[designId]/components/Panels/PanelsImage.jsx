import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button, Slider, Popover } from "antd";
import { useClickAway } from "react-use";
import PanelsCommon from "./PanelsCommon";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateLayer } from '@/redux/slices/editor/stageSlice';

const SliderMenu = ({
  onChangeBrightness,
  onChangeOpacity,
  onChangeContrast,
  onChangeSaturate,
  valueBrightness,
  valueOpacity,
  valueContrast,
  valueSaturate,
}) => (
  <div className="w-[250px]">
    <div className="p-2">
      <span>Độ sáng</span>
      <Slider onChange={onChangeBrightness} value={valueBrightness} />
    </div>
    <div className="p-2">
      <span>Độ trong</span>
      <Slider onChange={onChangeOpacity} value={valueOpacity} />
    </div>
    <div className="p-2">
      <span>Độ tương phản</span>
      <Slider onChange={onChangeContrast} value={valueContrast} />
    </div>
    <div className="p-2">
      <span>Độ bão hòa</span>
      <Slider onChange={onChangeSaturate} value={valueSaturate} />
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
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();
  console.log('🚀 ~ PanelsImage ~ selectedLayer:', selectedLayer)
  // States for sliders
  const [valueBrightness, setValueBrightness] = useState(0);
  const [valueOpacity, setValueOpacity] = useState(0); // Set default value to 100
  const [valueContrast, setValueContrast] = useState(0);
  const [valueSaturate, setValueSaturate] = useState(0);

  useEffect(() => {
    setValueOpacity(selectedLayer.content.opacity * 100)
  }, [selectedLayer.id])

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

  useEffect(() => {
    const data = {
      opacity: valueOpacity / 100
    }
    console.log('--------------------------------', data);
    dispatch(updateLayer({ id: selectedLayer.id, data: data }));
  }, [valueOpacity, selectedLayer.id]);

  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <div className="flex items-center">
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

          <div className="px-1" ref={popoverRefEditImage}>
            <Popover
              content={
                <SliderMenu
                  onChangeBrightness={handleSliderBrightness}
                  onChangeOpacity={handleSliderOpacity}
                  onChangeContrast={handleSliderContrast}
                  onChangeSaturate={handleSliderSaturate}
                  valueBrightness={valueBrightness}
                  valueOpacity={valueOpacity}
                  valueContrast={valueContrast}
                  valueSaturate={valueSaturate}
                />
              }
              trigger="click"
              open={visibleEditImage}
              onOpenChange={setVisibleEditImage}>
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonEditImage}>
                Chỉnh sửa ảnh
              </Button>
            </Popover>
          </div>

          <div className="px-1" ref={popoverRefChangeImage}>
            <Popover
              content={
                <ButtonMenu
                  onButtonChangeImageNew={handleButtonChangeImageNew}
                  onButtonChangeImage={handleButtonChangeImage}
                />
              }
              trigger="click"
              open={visibleChangeImage}
              onOpenChange={setVisibleChangeImage}
              placement="bottomLeft">
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonImage}>
                Thay ảnh
              </Button>
            </Popover>
          </div>

          <div className="px-1">
            <Button type="text" className="text-lg font-bold">
              Cắt ảnh
            </Button>
          </div>
        </div>

        <div>
          <PanelsCommon />
        </div>
      </div>
    </div>
  );
};

export default PanelsImage;
