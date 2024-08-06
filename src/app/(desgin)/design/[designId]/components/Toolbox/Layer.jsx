/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LockedIcon from "../../Icon/Locked";
import UnlockedIcon from "../../Icon/Unlocked";
import Eye from "../../Icon/Eye";
import EyeCrossed from "../../Icon/EyeCrossed";
import Delete from "../../Icon/Delete";
import Drapdrop from "../../Icon/Drapdrop";

import { deleteLayerAPI } from "@/api/design";
import { useDispatch } from "react-redux";
import {
  addLayerText,
  removeLayer,
  selectLayer,
  updateLayer,
  updateListLayers,
} from "@/redux/slices/editor/stageSlice";
import { useSelector } from "react-redux";
import { Button, Tooltip, Popover, Input } from "antd";

import "@/styles/loading.css";
import Image from "next/image";

const Layer = () => {
  const { designLayers, design } = useSelector(
    (state) => state.stage.stageData
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // State for both forms
  // console.log("🚀 ~ Layer ~ selectedLayer:", selectedLayer);
  const [textForm, setTextForm] = useState({
    displayName: "",
    variableName: "",
    contentName: "",
  });

  const [imageForm, setImageForm] = useState({
    displayName: "",
    variableName: "",
  });

  const onDragEnd = (result) => {
  if (!result.destination) {
    return;
  }
  const items = Array.from(designLayers).reverse();
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  const updatedItems = items.reverse().map((item, index) => ({
    ...item,
    sort: index + 1,
  }));

  dispatch(updateListLayers(updatedItems));
};


  const handleDeleteLayer = (layer) => {
    const deleteLayerApi = async () => {
      try {
        const res = await deleteLayerAPI({
          idproduct: layer.products_id,
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
    deleteLayerApi();
  };

  const [isEditing, setIsEditing] = useState(false);

  const [initialContent, setInitialContent] = useState("");

  // Cập nhật giá trị nội dung chữ mặc định khi variableName thay đổi
  useEffect(() => {
    if (textForm.variableName) {
      setInitialContent(`%${textForm.variableName}%`);
    } else {
      setInitialContent("");
    }
  }, [textForm.variableName]);

  // Hàm xử lý khi nhấp vào ô input
  const handleInputClick = (e) => {
    e.target.select(); // Chọn toàn bộ văn bản khi nhấp vào ô input
  };

  // Hàm xử lý sự thay đổi nội dung
  const handleContentChange = (e) => {
    setTextForm({ ...textForm, contentName: e.target.value });
  };

  const getDisplayValue = () => {
    if (textForm.contentName) {
      return textForm.contentName;
    }
    return initialContent;
  };

  //Btn tạo biến
  const network = useSelector((state) => state.network.ipv4Address);

  const handleCreateVariableText = async () => {
    console.log("Text Variable Info:", textForm);

    const defaultFont = {
      name: "Open Sans",
      url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4nY1M2xLER.ttf",
    };

    try {
      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: design.id,
        token: checkTokenCookie(),
        text: getDisplayValue(),
        color: "#333333",
        size: "10px",
        font: defaultFont.name,
      });

      if (res.data.code === 1) {
        const newLayer = res.data.data;
        dispatch(addLayerText(newLayer));

        const data = {
          variable: textForm.variableName,
          variableLabel: textForm.displayName,
          text: getDisplayValue(),
        };
        dispatch(updateLayer({ id: newLayer.id, data: data }));
        setTextForm({ displayName: "", variableName: "", contentName: "" });
      } else {
        console.error("Failed to add text layer:", res.data);
      }
    } catch (error) {
      console.error("Error fetching fonts:", error);
      return;
    }
  };

  const handleCreateVariableImage = async () => {
    console.log("Image Variable Info:", imageForm);

    try {
      const res = await axios.post(`${network}/addLayerImageUrlAPI`, {
        idproduct: design.id,
        token: checkTokenCookie(),
        imageUrl:
          "https://apis.ezpics.vn//upload/admin/images/4274/4274_2024_07_29_17_20_27_2905.jpg",
        page: 0,
      });

      if (res.data.code === 1) {
        const newLayer = res.data.data;
        dispatch(addLayerText(newLayer));

        const data = {
          variable: imageForm.variableName,
          variableLabel: imageForm.displayName,
        };
        dispatch(updateLayer({ id: newLayer.id, data: data }));
        setImageForm({ displayName: "", variableName: "" });
      } else {
        console.error("Failed to add text layer:", res.data);
      }
    } catch (error) {
      console.error("Error fetching fonts:", error);
      return;
    }
  };

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      {design?.type === "user_series" && (
        <div className="flex justify-between">
          <Popover
            placement="rightBottom"
            trigger="click"
            autoFocus
            returnFocus
            content={
              <div className="w-[200px] h-fit p-2">
                <h4 className="text-base pb-2">Tên trường hiển thị biến:</h4>
                <Input
                  value={textForm.displayName}
                  onChange={(e) =>
                    setTextForm({ ...textForm, displayName: e.target.value })
                  }
                />
                <h4 className="text-base py-2">Tên biến:</h4>
                <Input
                  value={textForm.variableName}
                  onChange={(e) =>
                    setTextForm({ ...textForm, variableName: e.target.value })
                  }
                />
                <h4 className="text-base py-2">Nội dung chữ:</h4>
                <Input
                  value={getDisplayValue()}
                  onClick={handleInputClick}
                  onChange={handleContentChange}
                />
                <button
                  className="w-[100%] bg-black rounded-lg border border-transparent text-white px-4 py-2 my-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
                  onClick={handleCreateVariableText}>
                  Tạo biến chữ
                </button>
              </div>
            }>
            <button className="w-[48%] bg-black rounded-lg border border-transparent text-white px-4 py-2 my-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300">
              Biến chữ
            </button>
          </Popover>
          <Popover
            placement="rightBottom"
            trigger="click"
            autoFocus
            returnFocus
            content={
              <div className="w-[200px] h-fit p-2">
                <h4 className="text-base pb-2">Tên trường hiển thị biến:</h4>
                <Input
                  value={imageForm.displayName}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, displayName: e.target.value })
                  }
                />
                <h4 className="text-base py-2">Tên biến:</h4>
                <Input
                  value={imageForm.variableName}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, variableName: e.target.value })
                  }
                />
                <button
                  className="w-[100%] bg-black rounded-lg border border-transparent text-white px-4 py-2 my-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
                  onClick={handleCreateVariableImage}>
                  Tạo biến ảnh
                </button>
              </div>
            }>
            <button className="w-[48%] bg-black rounded-lg border border-transparent text-white px-4 py-2 my-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300">
              Biến ảnh
            </button>
          </Popover>
        </div>
      )}
      <div
        className="flex-1 flex flex-col h-[100%] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}>
        <h4 className="py-2">Danh sách Layers</h4>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"layerList"} type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
              {designLayers.length > 0 ? (
              (() => {
                const reversedLayers = [...designLayers]
                  .filter((layer) => layer.id !== undefined)
                  .reverse();
                console.log("Reversed designLayers:", reversedLayers);
                return reversedLayers.map((layer, index) => (
                  <Draggable
                    key={layer.id}
                    draggableId={layer.id.toString()}
                    index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="grid grid-cols-6 text-sm items-center py-2 my-1 border border-slate-200 hover:bg-[rgb(245,246,247)]"
                        onClick={() => {
                          dispatch(selectLayer({ id: layer.id }));
                        }}>
                        <button className="col-span-1 cursor-move">
                          <Drapdrop size={20} />
                        </button>
                        {layer.content.type === "text" ? (
                          <div className="col-span-3 cursor-pointer font-sans font-normal text-base w-[70%]">
                            {layer.content.text}
                          </div>
                        ) : (
                          <img
                            className="col-span-3"
                            src={layer.content.banner}
                            alt="Layer ảnh"
                            style={{
                              width: "auto",
                              height: 40,
                              maxWidth: "100px",
                              resize: "both",
                              border: "1px solid black",
                            }}
                          />
                        )}
                        <div className="flex items-center justify-end col-span-2">
                          <LockUnlock layer={layer} />
                          <VisibilityToggle layer={layer} />
                          <button
                            className="px-1"
                            onClick={() => handleDeleteLayer(layer)}>
                            <Delete size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ));
              })()
            ) : (
              <div>Layer trống</div>
            )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            position: "absolute",
            zIndex: 20000000000,
            top: "-50px",
          }}>
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
            <div className="ldio-4qpid53rus92">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <Image
              style={{
                position: "absolute",
                top: 10,
                left: 17,
                width: 40,
                height: 40,
                // alignSelf: 'center',
                zIndex: 999999,
              }}
              alt=""
              width={50}
              height={50}
              src="/images/EZPICS.png"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const LockUnlock = ({ layer }) => {
  const dispatch = useDispatch();
  const [locked, setLocked] = useState(layer.content.lock === 1);

  useEffect(() => {
    setLocked(layer.content.lock === 1);
  }, [layer]);

  const onChangeLocked = () => {
    const newLockState = locked ? 0 : 1;
    const updatedData = {
      ...layer.content,
      lock: newLockState,
      draggable: newLockState === 1,
    };

    setLocked(!locked);
    dispatch(updateLayer({ id: layer.id, data: updatedData }));
    console.log("layer :", layer, "updatedData :", updatedData);
  };

  return (
    <>
      {!locked ? (
        <Tooltip placement="bottom" title="Mở khóa Layers">
          <Button onClick={onChangeLocked} size="small" type="text">
            <UnlockedIcon size={25} />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title="Khóa Layers">
          <Button onClick={onChangeLocked} size="small" type="text">
            <LockedIcon size={25} />
          </Button>
        </Tooltip>
      )}
    </>
  );
};

const VisibilityToggle = ({ layer }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(layer.content.status === 1);

  useEffect(() => {
    setVisible(layer.content.status === 1);
  }, [layer]);

  const onChangeVisibility = () => {
    const newVisibilityState = visible ? 0 : 1;
    const updatedData = {
      ...layer.content,
      status: newVisibilityState,
    };

    setVisible(!visible);
    dispatch(updateLayer({ id: layer.id, data: updatedData }));
    console.log("layervisible :", layer, "updatedData :", updatedData);
  };

  return (
    <>
      {visible ? (
        <Tooltip placement="bottom" title="Ẩn Layer">
          <Button onClick={onChangeVisibility} size="small" type="text">
            <Eye size={20} />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title="Hiện Layer">
          <Button onClick={onChangeVisibility} size="small" type="text">
            <EyeCrossed size={20} />
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default Layer;
