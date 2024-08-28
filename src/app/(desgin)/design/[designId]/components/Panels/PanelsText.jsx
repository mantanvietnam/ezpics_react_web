import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  List,
  Input,
  Tooltip,
  Slider,
  ColorPicker,
} from "antd";
import { DownOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import PanelsCommon from "./PanelsCommon";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
import { upperCase } from "lodash";
import { saveListLayer } from "@/api/design";
import { checkTokenCookie } from "@/utils";
import { toast } from "react-toastify";

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
  valueLetterSpacing,
  valueLineSpacing,
  onChangeLetterSpacing,
  onChangeLineSpacing,
  onChangeLetterSpacingInput,
  onChangeLineSpacingInput,
}) => {
  return (
    <div className="w-[250px]">
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Giãn cách chữ</span>
          <Input
            type="number"
            value={valueLetterSpacing}
            onChange={onChangeLetterSpacingInput}
            className="w-[70px] text-center"
            min={0}
            max={100}
          />
        </div>
        <Slider
          onChange={onChangeLetterSpacing}
          value={valueLetterSpacing}
          className="mb-4"
          min={0}
          max={100}
          step={1}
          marks={{
            0: "0",
            100: "100",
          }}
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
            min={1}
            max={5}
            step={0.1}
          />
        </div>
        <Slider
          onChange={onChangeLineSpacing}
          value={valueLineSpacing}
          min={1}
          max={5}
          step={0.1}
          marks={{
            1: "1",
            5: "5",
          }}
        />
      </div>
    </div>
  );
};

export default SliderMenu;

export function PanelsText({
  maxPositions,
  onColorButtonClick,
  onFontsButtonClick,
  onDuplicateLayer,
  vwHeight,
  vwWidth,
}) {
  const { selectedLayer, initSize } = useSelector(
    (state) => state.stage.stageData
  );
  const stageData = useSelector((state) => state.stage.stageData);
  // Convert vw to px
  const [fontSize, setFontSize] = useState(12);
  const [postionText, setPostionText] = useState("left");
  const [fontStyle, setFontStyle] = useState({
    bold: "",
    italic: "",
    underline: "",
    uppercase: "",
  });

  const sizeValue = parseFloat(selectedLayer?.content?.size?.replace("vw", ""));

  // Hàm chuyển đổi từ vh sang pixel và từ pixel sang tỷ lệ lineHeight
  const giandongToLineHeight = (giandong) => {
    if (typeof giandong === "string" && giandong.endsWith("vh")) {
      const vhValue = parseFloat(giandong);
      if (!isNaN(vhValue)) {
        const lineHeightInPx = (vhValue / 100) * vwHeight; // Chuyển đổi từ vh sang px
        return lineHeightInPx / sizeValue; // Chuyển đổi từ px sang tỷ lệ
      }
    }
    // Nếu không phải là dạng vh, trả về giá trị parseFloat hoặc giá trị mặc định
    const parsedValue = parseFloat(giandong);
    return isNaN(parsedValue) ? 1 : parsedValue;
  };

  const lineHeightToGiandong = (lineHeight) => {
    const lineHeightInPx = lineHeight * sizeValue; // Chuyển đổi từ tỷ lệ lineHeight sang pixel
    const vhValue = (lineHeightInPx / vwHeight) * 100; // Chuyển đổi từ pixel sang vh
    return `${vhValue}vh`;
  };

  // Hàm chuyển đổi từ vw sang pixel và từ pixel sang giá trị letterSpacing
  const vwToLetterSpacing = (vw) => {
    if (typeof vw === "string" && vw.endsWith("vw")) {
      const vwValue = parseFloat(vw);
      if (!isNaN(vwValue)) {
        return (vwValue / 100) * vwWidth; // Chuyển đổi từ vw sang px
      }
    }
    return parseFloat(vw) || 0; // Giá trị mặc định nếu không thể chuyển đổi
  };

  // Hàm chuyển đổi từ giá trị letterSpacing sang vw
  const letterSpacingToVw = (letterSpacing) => {
    const vwValue = (letterSpacing / vwWidth) * 100; // Chuyển đổi từ pixel sang vw
    return `${vwValue}vw`;
  };

  //LetterSpacing
  const [valueLetterSpacing, setValueLetterSpacing] = useState(0);
  const [valueLineSpacing, setValueLineSpacing] = useState(1);

  const [color, setColor] = useState("");
  const [gradientColors, setGradientColors] = useState(
    selectedLayer?.content?.gradient_color || null
  );

   
const handleAddColor = () => {
  // Find the maximum position to increment for the new color
  const maxPosition = gradientColors.length
    ? Math.max(...gradientColors.map((color) => color.position))
    : 0;

  setGradientColors([
    ...gradientColors,
    { position: maxPosition + 1, color: "#ffffff" },
  ]);
};

const handleColorChange = (newColor, index) => {
  // Create a new array with updated color
  const newColors = gradientColors.map((colorObj, i) =>
    i === index ? { ...colorObj, color: newColor } : colorObj
  );

  setGradientColors(newColors);
};

 const handleSaveDesign = async () => {
   try {
     if (!stageData || !stageData.designLayers) {
       throw new Error("Invalid stageData or designLayers not found");
     }

     const updatedLayers = await Promise.all(
       stageData.designLayers.map(async (layer) => {
         if (
           layer.content.banner &&
           layer.content.banner.startsWith("data:image/png;base64")
         ) {
           const bannerBlob = dataURLToBlob(layer.content.banner);
           const token = checkTokenCookie();
           const formData = new FormData();

           formData.append("idproduct", stageData.design.id);
           formData.append("token", token);
           formData.append("idlayer", layer.id);
           formData.append("file", bannerBlob);

           const headers = {
             "Content-Type": "multipart/form-data",
           };

           const config = {
             headers: headers,
           };

           const response = await axios.post(
             "https://apis.ezpics.vn/apis/changeLayerImageNew",
             formData,
             config
           );
           console.log(response);

           if (response && response?.data?.code === 1) {
             return {
               id: layer.id,
               content: {
                 ...layer.content,
                 banner: response.data?.link, // Cập nhật banner thành Blob
               },
               sort: layer.sort,
             };
           }
         }
         return {
           id: layer.id,
           content: {
             ...layer.content,
           },
           sort: layer.sort,
         };
       })
     );

     const jsonData = JSON.stringify(updatedLayers);

     const response = await saveListLayer({
       idProduct: stageData.design?.id,
       token: checkTokenCookie(),
       listLayer: jsonData,
     });
     if (response.code == 1) {
       toast.success("Áp dụng màu gradient thành công", {
         autoClose: 500,
       });
     } else {
       toast.error("Áp dụng màu gradient thất bại!", {
         autoClose: 500,
       });
     }
   } catch (error) {
     console.error("Error saving design:", error);
   }
 };

const handleRemoveColor = (index) => {
  if (gradientColors.length > 2) {
    const newColors = gradientColors.filter((_, i) => i !== index);
    setGradientColors(newColors);
  } else {
    toast.error("Không thể xóa. Cần ít nhất 2 màu.");
  }
};


  useEffect(() => {
    if (selectedLayer) {
      const sizeValue = parseFloat(
        selectedLayer.content.size?.replace("vw", "")
      );
      setFontStyle({
        bold: selectedLayer.content.indam,
        italic: selectedLayer.content.innghieng,
        underline: selectedLayer.content.gachchan,
        uppercase: selectedLayer.content.uppercase,
      });
      setFontSize(sizeValue);
      setPostionText(selectedLayer.content.text_align);
      setColor(selectedLayer.content.color);
      setValueLetterSpacing(vwToLetterSpacing(selectedLayer.content.gianchu));
      setValueLineSpacing(giandongToLineHeight(selectedLayer.content.giandong));
       setGradientColors(selectedLayer.content.gradient_color);
    }
  }, [selectedLayer]);

  const dispatch = useDispatch();

  const handleSliderLetterSpacing = (newValue) => {
    setValueLetterSpacing(newValue);
  };
  const onChangeLetterSpacingInput = (e) => {
    const newValue = parseFloat(e.target.value) || 0;
    setValueLetterSpacing(newValue);
  };

  const handleSliderLineSpacing = (newValue) => {
    setValueLineSpacing(newValue);
  };
  const onChangeLineSpacingInput = (e) => {
    const newValue = parseFloat(e.target.value) || 1;
    setValueLineSpacing(newValue);
  };

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

  const handleTextCenter = (textAlign) => {
    setPostionText(textAlign);
  };


  useEffect(() => {
    const data = {
      size: `${fontSize}vw`,
      indam: fontStyle.bold,
      innghieng: fontStyle.italic,
      gachchan: fontStyle.underline,
      uppercase: fontStyle.uppercase,
      color: color,
      text_align: postionText,
      gianchu: letterSpacingToVw(valueLetterSpacing),
      giandong: lineHeightToGiandong(valueLineSpacing),
      gradient_color: gradientColors,
    };
    dispatch(updateLayer({ id: selectedLayer.id, data: data }));
  }, [
    selectedLayer.id,
    fontSize,
    fontStyle,
    color,
    postionText,
    valueLetterSpacing,
    valueLineSpacing,
    gradientColors,
    dispatch,
  ]);
  console.log("🚀 ~ fontStyle:", gradientColors);

  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <div className="flex items-center">
          <div className="px-1">
            <Tooltip title="Chọn phông chữ" placement="bottom">
              <Button
                type="text"
                onClick={() => onFontsButtonClick()}
                className="flex items-center rounded-lg border border-slate-400"
              >
                <p className="w-[125px] flex items-start text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedLayer.content.font}
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
                trigger="click"
              >
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
              <Button
                type="text"
                className="flex items-center px-2"
                onClick={() => onColorButtonClick()}
              >
                <div className="flex flex-col justify-center w-full h-8">
                  <p className="text-[18px] font-bold h-6">A</p>
                  <div
                    className="w-6 h-2 mt-1 rounded"
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Chọn kiểu chữ đậm" placement="bottom">
              <Button
                type="text"
                className={`flex items-center px-2 ${
                  fontStyle.bold === "bold" || fontStyle.bold === "bolder"
                    ? "bg-gray-300"
                    : ""
                }`}
                onClick={() => handleFontStyleChange("bold", "bolder")}
              >
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path d="M177.08 114.46A48 48 0 0 0 140 36H72a12 12 0 0 0-12 12v152a12 12 0 0 0 12 12h80a52 52 0 0 0 25.08-97.54ZM84 60h56a24 24 0 0 1 0 48H84Zm68 128H84v-56h68a28 28 0 0 1 0 56Z"></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Chọn kiểu chữ nghiêng" placement="bottom">
              <Button
                type="text"
                className={`flex items-center px-2 ${
                  fontStyle.italic === "italic" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleFontStyleChange("italic", "italic")}
              >
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="m14.73 6.5-3.67 11H14l-.3 1.5H6l.3-1.5h2.81l3.68-11H10l.3-1.5H18l-.3 1.5h-2.97z"
                    ></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Chọn kiểu chữ gạch dưới" placement="bottom">
              <Button
                type="text"
                className={`flex items-center px-2 ${
                  fontStyle.underline === "underline" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleFontStyleChange("underline", "underline")}
              >
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path d="M200 224a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h128a8 8 0 0 1 8 8Zm-72-24a64.07 64.07 0 0 0 64-64V56a8 8 0 0 0-16 0v80a48 48 0 0 1-96 0V56a8 8 0 0 0-16 0v80a64.07 64.07 0 0 0 64 64Z"></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Viết in hoa toàn bộ" placement="bottom">
              <Button
                type="text"
                className={`flex items-center px-2 ${
                  fontStyle.uppercase === "uppercase" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleFontStyleChange("uppercase", "uppercase")}
              >
                <div className="flex flex-col justify-center w-full h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="m8.77 19-.29-1.37h-.07c-.48.6-.96 1.01-1.44 1.22-.47.22-1.07.33-1.79.33-.95 0-1.7-.25-2.24-.74-.54-.5-.81-1.2-.81-2.1 0-1.95 1.55-2.97 4.66-3.06l1.64-.05v-.6c0-.76-.17-1.32-.5-1.68-.32-.36-.84-.54-1.55-.54-.8 0-1.71.25-2.73.74l-.44-1.11a6.86 6.86 0 0 1 3.26-.83c1.15 0 2 .25 2.55.76.55.51.83 1.33.83 2.46V19H8.77zm-3.3-1.03c.91 0 1.63-.25 2.14-.75.52-.5.78-1.2.78-2.09v-.87l-1.46.06a5.3 5.3 0 0 0-2.5.54c-.52.32-.78.82-.78 1.5 0 .52.16.92.48 1.2.32.27.77.41 1.34.41zM21.15 19l-1.6-4.09H14.4L12.82 19h-1.51l5.08-12.9h1.26L22.7 19h-1.55zm-2.06-5.43-1.5-3.98c-.19-.5-.39-1.13-.6-1.86-.12.56-.3 1.18-.55 1.86l-1.5 3.98h4.15z"
                    ></path>
                  </svg>
                </div>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <div className="w-[1px] h-[24px] bg-black"></div>
          </div>

          <div className="px-1">
            <Tooltip title="Căn trái" placement="bottom">
              <Button
                type="text"
                className="text-lg font-bold px-1"
                onClick={() => handleTextCenter("left")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px"
                >
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm8 48h128a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 24H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-48 40H40a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Căn giữa" placement="bottom">
              <Button
                type="text"
                className="text-lg font-bold px-1"
                onClick={() => handleTextCenter("center")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px"
                >
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm32 32a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm152 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm-24 40H64a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <Tooltip title="Căn phải" placement="bottom">
              <Button
                type="text"
                className="text-lg font-bold px-1"
                onClick={() => handleTextCenter("right")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="24px"
                  height="24px"
                >
                  <path d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8Zm184 32H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm0 40H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Zm0 40H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Z"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>

          <div className="px-1">
            <div className="w-[1px] h-[24px] bg-black"></div>
          </div>

          <div className="px-1">
            <Popover
              content={
                <SliderMenu
                  valueLetterSpacing={valueLetterSpacing}
                  onChangeLetterSpacing={handleSliderLetterSpacing}
                  onChangeLetterSpacingInput={onChangeLetterSpacingInput}
                  valueLineSpacing={valueLineSpacing}
                  onChangeLineSpacing={handleSliderLineSpacing}
                  onChangeLineSpacingInput={onChangeLineSpacingInput}
                />
              }
              trigger="click"
            >
              <Tooltip title="Giãn cách" placement="bottom">
                <Button type="text" className="text-lg font-bold px-1">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 12c0 .4-.3.8-.7.8h-9.7c-.4 0-.7-.3-.7-.8 0-.4.3-.8.7-.8h9.7c.4 0 .7.4.7.8zM10.6 6.8h9.7c.4 0 .7-.4.7-.8s-.3-.8-.7-.8h-9.7c-.4 0-.7.3-.7.8 0 .4.4.8.7.8zM20.3 17.2h-9.7c-.4 0-.7.3-.7.8s.3.8.7.8h9.7c.4 0 .7-.3.7-.8s-.3-.8-.7-.8zM8.4 17.2c.3.2.3.6 0 .9l-3 2.5c-.3.2-.8.2-1.1 0l-3-2.5c-.3-.2-.3-.6 0-.9.3-.2.8-.2 1.1 0l1.7 1.4V5.3L2.4 6.8c-.3.2-.8.2-1.1 0-.3-.3-.3-.7 0-.9l3-2.5c.3-.2.8-.2 1.1 0l3 2.5c.3.2.3.6 0 .9-.3.2-.8.2-1.1 0L5.6 5.3v13.3l1.7-1.4c.3-.2.8-.2 1.1 0z"></path>
                  </svg>
                </Button>
              </Tooltip>
            </Popover>
          </div>

          <Popover
            trigger="click"
            placement="bottom"
            content={
              <div className="w-[150px]">
                <div className="flex">
                  <strong className="w-[100px]">Chọn màu</strong>
                  {/* <Button onClick={handleAddColor}>
                    Thêm màu <PlusOutlined />
                  </Button> */}
                </div>
                {gradientColors.map((colorObj, index) => (
                  <div key={index} className="flex items-center my-2">
                    <Input
                      type="color"
                      value={colorObj.color}
                      onChange={(e) => handleColorChange(e.target.value, index)}
                    />
                    <Button
                      onClick={() => handleRemoveColor(index)}
                      type="text"
                      danger
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                {/* Apply button to save design */}
                <Button
                  className="text-sm font-bold mt-2 bg-[#cbaa40] p-2 rounded-lg"
                  onClick={handleSaveDesign}
                >
                  Áp dụng
                </Button>
              </div>
            }
          >
            <Button
              type="text"
              className="flex items-center rounded-lg border border-slate-400"
            >
              <div
                className="w-[50px] h-[30px] flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${gradientColors
                    .map((c) => c.color)
                    .join(", ")})`,
                }}
              ></div>
              <DownOutlined />
            </Button>
          </Popover>
        </div>

        <div>
          <PanelsCommon
            maxPositions={maxPositions}
            onDuplicateLayer={onDuplicateLayer}
          />
        </div>
      </div>
    </div>
  );
}
