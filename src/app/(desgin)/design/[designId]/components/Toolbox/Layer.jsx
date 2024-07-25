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
  removeLayer,
  selectLayer,
  updateLayer,
  updateListLayers,
} from "@/redux/slices/editor/stageSlice";
import { useSelector } from "react-redux";
import { Button, Tooltip } from "antd";

const Layer = () => {
  const { designLayers, selectedLayer } = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(designLayers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the sort value
    const updatedItems = items.map((item, index) => ({
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

  return (
    <div className="absolute top-0 left-[108px] h-full w-[300px] px-2">
      <div
        className="flex-1 flex flex-col h-[100%] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}>
        <h4 className="py-2">Danh sách Layers</h4>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"layerList"} type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {designLayers.length > 0 ? (
                  designLayers
                    .filter((layer) => layer.id !== undefined)
                    .map((layer, index) => (
                      <Draggable
                        key={layer.id}
                        draggableId={layer.id.toString()}
                        index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="grid grid-cols-6 text-sm items-center py-2 my-1 border border-slate-200 hover:bg-[rgb(245,246,247)]">
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
                    ))
                ) : (
                  <div>Layer trống</div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
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
