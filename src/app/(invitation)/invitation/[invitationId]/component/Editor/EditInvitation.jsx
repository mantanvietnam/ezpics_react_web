import React, { useState, useEffect, useRef } from "react";
import {
  updateLayer,
  addLayerImage,
  removeLayer,
  addLayerText,
  moveLayerToFinal,
  moveLayerToFront,
  selectLayer,
  deselectLayerTool,
} from "@/redux/slices/print/printSlice";
import { deleteLayerAPI } from "@/api/design";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { Slider, Input, Popover, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useFonts from "@/hooks/useLoadFont";

const EditInvitation = () => {
  const [imgSrc, setImgSrc] = useState("");
  const stageData = useSelector((state) => state.print.stageData);
  const { design, initSize, designLayers } = stageData;
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network.ipv4Address);

  //font chu
  const { fonts, loading } = useFonts();
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");

  useEffect(() => {
    setFilteredFonts(
      fonts.filter((fontOption) => fontOption.name.toLowerCase())
    );
  }, [fonts]);

  const handleFontSelect = (font, layer) => {
    setSelectedFont(font.name);
    const newContent = { ...layer.content };
    newContent.font = font.name;
    dispatch(
      updateLayer({
        id: layer.id,
        data: newContent,
      })
    );
  };

  // Lọc các layer có biến 'variable' không phải là chuỗi rỗng
  const filteredLayerImage = designLayers.filter(
    (layer) =>
      layer.content.type === "image" &&
      layer.content.variable &&
      layer.content.variable.trim() !== ""
  );

  async function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      const url = URL.createObjectURL(file);
      if (!/(png|jpg|jpeg)$/i.test(file.name)) {
        toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
        return;
      }

      reader.onloadend = () => {
        const newImgSrc = reader.result?.toString() || "";
        setImgSrc(newImgSrc);
      };

      const res = await axios.post(
        `https://apis.ezpics.vn/apis/addLayerImageAPI`,
        {
          idproduct: stageData.design.id,
          token: checkTokenCookie(),
          file: file,
          page: 0,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.code === 1) {
        const newLayer = res.data.data;
        dispatch(addLayerText(newLayer));
        dispatch(updateLayer(newLayer));

        const data = {
          variable: "avatar",
          variableLabel: "Thay ảnh avatar",
        };
        dispatch(updateLayer({ id: newLayer.id, data: data }));
      } else {
        console.error("Failed to add text layer:", res.data);
      }

      reader.readAsDataURL(file);
    }
  }

  const handleDeleteLayer = async () => {
    try {
      const res = await deleteLayerAPI({
        idproduct: design.id,
        idlayer: filteredLayerImage[0].id,
        token: checkTokenCookie(),
      });
      if (res.code === 1) {
        dispatch(removeLayer(filteredLayerImage[0].id));
        setImgSrc("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLayerText = async (layer) => {
    try {
      const res = await deleteLayerAPI({
        idproduct: design.id,
        idlayer: layer.id,
        token: checkTokenCookie(),
      });
      if (res.code === 1) {
        dispatch(removeLayer(layer.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateLayer = (property, value) => {
    if (filteredLayerImage.length > 0) {
      const layerId = filteredLayerImage[0].id; // Layer ID to update
      const newContent = { ...filteredLayerImage[0].content };

      // Calculate the new value based on the property
      if (property === "zoom") {
        newContent["width"] = `${value}vw`;
      } else if (property === "postion_left" || property === "postion_top") {
        newContent[property] = value;
      } else {
        newContent[property] = value;
      }

      // Dispatch the action to update the layer with the new content
      dispatch(
        updateLayer({
          id: layerId,
          data: newContent,
        })
      );
    }
  };

  const handleUpdateLayerText = (property, value, layer) => {
    const newContent = { ...layer.content };

    switch (property) {
      case "postion_left":
      case "postion_top":
        newContent[property] = value;
        break;

      case "size":
        newContent.size = `${value}vw`;
        break;

      case "color":
        const timeoutId = setTimeout(() => {
          newContent.color = value;
          dispatch(
            updateLayer({
              id: layer.id,
              data: newContent,
            })
          );
        }, 300);
        return () => clearTimeout(timeoutId);

      case "text":
        newContent.text = value;
        break;

      default:
        newContent[property] = value;
        break;
    }

    if (property !== "color") {
      dispatch(
        updateLayer({
          id: layer.id,
          data: newContent,
        })
      );
    }
  };

  const handleCreateVariableText = async () => {
    try {
      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: design.id,
        token: checkTokenCookie(),
        text: "Thêm chữ",
        color: "#000000",
        size: "5px",
        font: "Helve",
      });

      if (res.data.code === 1) {
        const newLayer = res.data.data;
        dispatch(addLayerText(newLayer));
        dispatch(updateLayer(newLayer));

        const data = {
          variable: "thayten",
          variableLabel: "Thay tên",
        };

        dispatch(updateLayer({ id: newLayer.id, data: data }));
      } else {
        console.error("Failed to add text layer:", res.data);
      }
    } catch (error) {
      console.error("Error fetching fonts:", error);
      return;
    }
  };

  const buttonEditRef = useRef(null);

  const handleEditAvatar = () => {
    dispatch(moveLayerToFront({ id: filteredLayerImage[0]?.id }));
    dispatch(selectLayer({ id: filteredLayerImage[0]?.id }));
  };

  const handleSaveAvatar = () => {
    dispatch(moveLayerToFinal({ id: filteredLayerImage[0]?.id }));
    // dispatch(deselectLayerTool());
  };

  // Effect to handle 'blur' and 'Enter' events

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside the button, call handleSaveAvatar
      if (
        buttonEditRef.current &&
        !buttonEditRef.current.contains(event.target) &&
        filteredLayerImage[0]?.id
      ) {
        console.log("save");
        handleSaveAvatar(); // Using handleSaveAvatar function for clarity
      }
    };

    const handleKeyPress = (event) => {
      // If the Enter key is pressed, call handleSaveAvatar
      if (event.key === "Enter" && filteredLayerImage[0]?.id) {
        handleSaveAvatar();
      }
    };

    // Add event listeners for clicks outside and key presses
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keypress", handleKeyPress);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [dispatch, filteredLayerImage]);

  return (
    <div>
      <div>
        <div className="border-b border-gray-500 mb-5 pb-3">
          <div className="mb-2 flex justify-between">
            <h1 className="text-xl font-bold">Ảnh đại diện</h1>
            {(imgSrc || filteredLayerImage[0]?.content?.banner) && (
              <button
                className="text-[12px] bg-red-600 text-white ml-2 px-2 rounded"
                onClick={() => handleDeleteLayer()}
              >
                Xóa
              </button>
            )}
          </div>
          <div>
            {imgSrc || filteredLayerImage[0]?.content?.banner ? (
              <div className="flex flex-col justify-center items-center">
                <div
                  ref={buttonEditRef}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden", // Ẩn phần ảnh bị tràn
                    width: "40%",
                    height: "auto", // Chiều cao tự động dựa trên kích thước ảnh
                    cursor: "pointer",
                  }}
                  className="hover:shadow-lg hover:shadow-yellow-500/50"
                  onClick={handleEditAvatar}
                >
                  <img
                    src={imgSrc || filteredLayerImage[0]?.content?.banner}
                    alt=""
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain", // Đảm bảo ảnh không bị méo
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col relative mobile:pt-4">
                <form
                  id="file-upload-form"
                  className="block clear-both mx-auto w-full max-w-600"
                >
                  <input
                    className="hidden"
                    id="file-upload"
                    type="file"
                    name="fileUpload"
                    accept="image/*"
                    onChange={onSelectFile}
                  />

                  <label
                    className="float-left clear-both w-full py-8 px-6 text-center bg-white rounded-lg border transition-all select-none"
                    htmlFor="file-upload"
                    id="file-drag"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      id="file-image"
                      src="#"
                      alt="Preview"
                      className="hidden"
                    />
                    <div id="">
                      <img
                        src="/images/direct-download.png"
                        alt=""
                        style={{
                          width: 30,
                          height: 30,
                          alignSelf: "center",
                          margin: "0 auto",
                          marginBottom: "2%",
                        }}
                      />
                      <div id="notimage" className="hidden">
                        Hãy chọn ảnh
                      </div>
                      <span id="file-upload-btn" className="">
                        {imgSrc === "" && "Chọn ảnh"}
                      </span>
                    </div>
                  </label>
                </form>
              </div>
            )}
            <div>
              <p>Chiều ngang</p>
              <Slider
                min={0}
                max={100} // Adjusted to 0-100% range for position
                value={filteredLayerImage[0]?.content?.postion_left || 0}
                onChange={(value) => {
                  handleUpdateLayer("postion_left", value); // Corrected to "position_left"
                }}
              />
              <p>Chiều dọc</p>
              <Slider
                min={0}
                max={100} // Adjusted to 0-100% range for position
                value={filteredLayerImage[0]?.content?.postion_top || 0}
                onChange={(value) => {
                  handleUpdateLayer("postion_top", value); // Corrected to "position_top"
                }}
              />
              <p>Zoom</p>
              <Slider
                min={10}
                max={100}
                value={
                  filteredLayerImage[0]?.content?.width.replace("vw", "") || 0
                }
                onChange={(value) => {
                  handleUpdateLayer("zoom", value); // Use "zoom" to update width correctly
                }}
              />
            </div>
          </div>
        </div>

        <div>
          {designLayers
            .filter((layer) => layer.content.type === "text")
            .map((layer) => (
              <div
                key={layer.id}
                className="border-b border-gray-500 mb-4 pb-3"
              >
                <div className="mb-2 flex justify-between">
                  <h1 className="text-xl font-bold">Chỉnh sửa chữ</h1>
                  <button
                    className="text-[12px] bg-red-600 text-white ml-2 px-2 rounded"
                    onClick={() => handleDeleteLayerText(layer)}
                  >
                    Xóa
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-[40%]">Chữ mặc định:</span>
                  <Input
                    type="text"
                    placeholder={layer.content.text || "Điền chữ"}
                    value={layer.content.text || ""}
                    onChange={(e) =>
                      handleUpdateLayerText("text", e.target.value, layer)
                    }
                  />
                </div>
                <div>
                  <p>Chiều ngang</p>
                  <Slider
                    min={0}
                    max={100} // Adjusted to 0-100% range for position
                    value={layer.content?.postion_left || 0}
                    onChange={(value) => {
                      handleUpdateLayerText("postion_left", value, layer); // Corrected to "position_left"
                    }}
                  />
                  <p>Chiều dọc</p>
                  <Slider
                    min={0}
                    max={100} // Adjusted to 0-100% range for position
                    value={layer.content?.postion_top || 0}
                    onChange={(value) => {
                      handleUpdateLayerText("postion_top", value, layer); // Corrected to "position_top"
                    }}
                  />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="flex items-center">
                    <p>Cỡ chữ</p>
                    <Input
                      type="number"
                      onChange={(e) =>
                        handleUpdateLayerText("size", e.target.value, layer)
                      }
                      value={
                        layer?.content?.size
                          ? layer?.content?.size.replace("vw", "")
                          : "5"
                      }
                      min={1}
                      className="w-[80px] text-lg font-bold text-center border-x rounded-none ml-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <p>Màu chữ</p>
                    <Input
                      type="color"
                      value={layer.content?.color || "#000000"}
                      onChange={(e) =>
                        handleUpdateLayerText("color", e.target.value, layer)
                      }
                      className="w-[30px] text-lg font-bold text-center border-x rounded-none ml-2 p-0"
                    />
                  </div>

                  <div className="flex items-center col-span-2">
                    <p>Font chữ</p>
                    <Popover
                      placement="rightTop"
                      content={
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                          {filteredFonts.map((font) => (
                            <div
                              key={font.name}
                              onClick={() => handleFontSelect(font, layer)}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                              style={{ fontFamily: font.name }}
                            >
                              {font.name}
                            </div>
                          ))}
                        </div>
                      }
                      trigger="click"
                    >
                      <Input
                        value={selectedFont ? selectedFont : layer.content.font}
                        placeholder="Chọn font"
                        readOnly
                        className="w-[150px] ml-2 text-ellipsis overflow-hidden whitespace-nowrap"
                      />
                    </Popover>
                  </div>
                </div>
              </div>
            ))}

          <button
            className="px-2 py-1 my-2 text-white bg-black hover:text-black hover:bg-white rounded border"
            onClick={handleCreateVariableText}
          >
            Tạo chữ
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInvitation;
