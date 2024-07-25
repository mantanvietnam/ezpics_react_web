import React, { useState, useEffect } from "react";
import { Button, Popover, List, Input, Tooltip, Slider } from "antd";
import { DownOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import PanelsCommon from "./PanelsCommon";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";

const fontSizes = [
  8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64,
];

const ListFontStyle = ({ onSelect }) => (
  <List
    className="h-[440px] overflow-y-auto w-[80px] flex justify-center"
    dataSource={fontSizes}
    renderItem={(item) => (
      <List.Item onClick={() => onSelect(item)} style={{ cursor: "pointer" }}>
        {item}
      </List.Item>
    )}
  />
);

const SliderMenu = ({
  valueLetteringSpacing,
  valueLineSpacing,
  onChangeLetteringSpacing,
  onChangeLineSpacing,
  onChangeLetteringSpacingInput,
  onChangeLineSpacingInput,
}) => {
  return (
    <div className="w-[250px]">
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Giãn cách chữ</span>
          <Input
            type="number"
            value={valueLetteringSpacing}
            onChange={onChangeLetteringSpacingInput}
            className="w-[70px] text-center"
            min={0}
            max={100}
          />
        </div>
        <Slider
          onChange={onChangeLetteringSpacing}
          value={valueLetteringSpacing}
          className="mb-4"
        />
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Khoảng cách dòng</span>
          <Input
            type="number"
            value={valueLineSpacing}
            onChange={onChangeLineSpacingInput}
            className="w-[70px] text-center"
            min={0}
            max={100}
          />
        </div>
        <Slider onChange={onChangeLineSpacing} value={valueLineSpacing} />
      </div>
    </div>
  );
};

export default SliderMenu;

export function PanelsText({ maxPositions }) {
  const { selectedLayer, initSize } = useSelector(
    (state) => state.stage.stageData
  );
  // Convert vw to px
  const sizeValue = parseFloat(selectedLayer.content.size?.replace("vw", ""));
  const [fontStyle, setFontStyle] = useState({
    bold: selectedLayer.content.indam,
    italic: selectedLayer.content.innghieng,
    underline: selectedLayer.content.gachchan,
  });

  const [fontSize, setFontSize] = useState(sizeValue);
  const dispatch = useDispatch();

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 1);
  };
  const handleFontStyleChange = (type, value) => {
    setFontStyle((prevFontStyle) => ({
      ...prevFontStyle,
      [type]: prevFontStyle[type] === value ? "normal" : value,
    }));
  };

  useEffect(() => {
    const data = {
      size: `${fontSize}vw`,
      indam: fontStyle.bold,
      innghieng: fontStyle.italic,
      gachchan: fontStyle.underline,
    };
    console.log("🚀 ~ useEffect :", selectedLayer);
    console.log("🚀 ~ useEffect ~ data:", data);
    dispatch(updateLayer({ id: selectedLayer.id, data: data }));
  }, [selectedLayer.id, fontSize, fontStyle]);

  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <div className="flex items-center">
          <div className="px-1">
            <Tooltip title="Chọn phông chữ" placement="bottom">
              <Button
                type="text"
                className="flex items-center rounded-lg border border-slate-400">
                <p className="w-[125px] flex items-start text-lg font-bold">
                  Open Sans
                </p>
                <DownOutlined />
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <div className="flex items-center rounded-lg border border-slate-400">
              <Tooltip title="Giảm kích thước" placement="bottom">
                <Button type="text" onClick={decreaseFontSize}>
                  <MinusOutlined />
                </Button>
              </Tooltip>
              <Popover
                content={<ListFontStyle onSelect={handleFontSizeChange} />}
                trigger="click">
                <Input
                  type="number"
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  value={fontSize}
                  className="w-[80px] text-lg font-bold text-center border-x rounded-none"
                />
              </Popover>
              <Tooltip title="Tăng kích thước" placement="bottom">
                <Button type="text" onClick={increaseFontSize}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="pl-1">
            <Tooltip title="Chọn màu chữ" placement="bottom">
              <Button type="text" className="flex items-center px-2">
                <div className="flex flex-col justify-center w-full h-8">
                  <p className="text-[18px] font-bold h-6">A</p>
                  <div className="w-6 h-2 mt-1 bg-red-600 rounded"></div>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div>
            <Tooltip title="Chọn kiểu chữ đậm" placement="bottom">
              <Button
                type="text"
                className="flex items-center px-2"
                onClick={() => handleFontStyleChange("bold", "bolder")}>
                <div className="flex flex-col justify-center w-full h-8">
                  <p className="text-[20px] font-bold">B</p>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div>
            <Tooltip title="Chọn kiểu chữ nghiêng" placement="bottom">
              <Button
                type="text"
                className="flex items-center px-2"
                onClick={() => handleFontStyleChange("italic", "italic")}>
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="m14.73 6.5-3.67 11H14l-.3 1.5H6l.3-1.5h2.81l3.68-11H10l.3-1.5H18l-.3 1.5h-2.97z"></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div>
            <Tooltip title="Chọn kiểu chữ gạch dưới" placement="bottom">
              <Button
                type="text"
                className="flex items-center px-2"
                onClick={() => handleFontStyleChange("underline", "underline")}>
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    width="20"
                    height="20">
                    <path d="M200 224a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h128a8 8 0 0 1 8 8Zm-72-24a64.07 64.07 0 0 0 64-64V56a8 8 0 0 0-16 0v80a48 48 0 0 1-96 0V56a8 8 0 0 0-16 0v80a64.07 64.07 0 0 0 64 64Z"></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          {/* <div>
            <Tooltip title="Chọn kiểu chữ hoa/chữ thường" placement="bottom">
              <Button
                type="text"
                className="flex items-center px-2"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="20"
                  height="20">
                  <path d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144 80 74.79 112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68 13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25 8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36Zm0 88c-13.23 0-24-9-24-20s10.77-20 24-20 24 9 24 20-10.77 20-24 20Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div> */}

          <div className="px-1">
            <div className="w-[1px] h-[24px] bg-black"></div>
          </div>

          <div className="px-1">
            <Tooltip title="Căn trái" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm8 48h128a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 24H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-48 40H40a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Căn giữa" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm32 32a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm152 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-24 40H64a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Căn phải" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm184 32H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm0 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm0 40H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Căn hai bên" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm184 32H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm0 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm0 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <div className="w-[1px] h-[24px] bg-black"></div>
          </div>

          <div className="px-1">
            <Tooltip title="Danh sách" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M80 64a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8Zm136 56H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm0 64H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16ZM44 52a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Danh sách" placement="bottom">
              <Button type="text" className="text-lg font-bold px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px">
                  <path d="M224 128a8 8 0 0 1-8 8H104a8 8 0 0 1 0-16h112a8 8 0 0 1 8 8ZM104 72h112a8 8 0 0 0 0-16H104a8 8 0 0 0 0 16Zm112 112H104a8 8 0 0 0 0 16h112a8 8 0 0 0 0-16ZM43.58 55.16 48 52.94V104a8 8 0 0 0 16 0V40a8 8 0 0 0-11.58-7.16l-16 8a8 8 0 0 0 7.16 14.32Zm36.19 101.56a23.73 23.73 0 0 0-9.6-15.95 24.86 24.86 0 0 0-34.11 4.7 23.63 23.63 0 0 0-3.57 6.46 8 8 0 1 0 15 5.47 7.84 7.84 0 0 1 1.18-2.13 8.76 8.76 0 0 1 12-1.59 7.91 7.91 0 0 1 3.26 5.32 7.64 7.64 0 0 1-1.57 5.78 1 1 0 0 0-.08.11l-28.69 38.32A8 8 0 0 0 40 216h32a8 8 0 0 0 0-16H56l19.08-25.53a23.47 23.47 0 0 0 4.69-17.75Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Popover content={<SliderMenu />} trigger="click">
              <Tooltip title="Giãn cách" placement="bottom">
                <Button type="text" className="text-lg font-bold px-1">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12c0 .4-.3.8-.7.8h-9.7c-.4 0-.7-.3-.7-.8 0-.4.3-.8.7-.8h9.7c.4 0 .7.4.7.8zM10.6 6.8h9.7c.4 0 .7-.4.7-.8s-.3-.8-.7-.8h-9.7c-.4 0-.7.3-.7.8 0 .4.4.8.7.8zM20.3 17.2h-9.7c-.4 0-.7.3-.7.8s.3.8.7.8h9.7c.4 0 .7-.3.7-.8s-.3-.8-.7-.8zM8.4 17.2c.3.2.3.6 0 .9l-3 2.5c-.3.2-.8.2-1.1 0l-3-2.5c-.3-.2-.3-.6 0-.9.3-.2.8-.2 1.1 0l1.7 1.4V5.3L2.4 6.8c-.3.2-.8.2-1.1 0-.3-.3-.3-.7 0-.9l3-2.5c.3-.2.8-.2 1.1 0l3 2.5c.3.2.3.6 0 .9-.3.2-.8.2-1.1 0L5.6 5.3v13.3l1.7-1.4c.3-.2.8-.2 1.1 0z"></path>
                  </svg>
                </Button>
              </Tooltip>
            </Popover>
          </div>
        </div>

        <div>
          <PanelsCommon maxPositions={maxPositions} />
        </div>
      </div>
    </div>
  );
}
