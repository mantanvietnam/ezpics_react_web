import React, { useState, useEffect } from "react";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Locked from "../../Icon/Locked";
import Unlocked from "../../Icon/Unlocked";
import Eye from "../../Icon/Eye";
import EyeCrossed from "../../Icon/EyeCrossed";
import Delete from "../../Icon/Delete";
import Drapdrop from "../../Icon/Drapdrop";

const Layer = () => {
  const [listLayers, setListLayers] = useState([]);

  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);

  console.log(idProduct);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`${network}/listLayerAPI`, {
          token: checkTokenCookie(),
          idproduct: idProduct,
        });
        console.log(response);
        if (response.data.code === 1) {
          setListLayers(response.data.data.productDetail);
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error);
      }
    }
    fetchData();
  }, [network]);

  console.log(listLayers);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(listLayers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListLayers(items);
  };
  return (
    <>
      <div className="absolute top-0 left-[96px] h-full w-[300px] border-r border-gray-300 px-2">
        <div className="flex-1 flex flex-col">
          <h4 className="py-2">Danh sách Layers</h4>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="layerList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {listLayers.length > 0 ? (
                  listLayers.map((layer, index) => (
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
                            {layer.content.lock === 1 ? (
                              <button className="px-1">
                                <Locked size={20} />{" "}
                              </button>
                            ) : (
                              <button className="px-1">
                                <Unlocked size={20} />
                              </button>
                            )}

                            {layer.content.status === 1 ? (
                              <button className="px-1">
                                <Eye size={20} />
                              </button>
                            ) : (
                              <button className="px-1">
                                <EyeCrossed size={20} />
                              </button>
                            )}

                            <button className="px-1">
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
    </>
  );
};

export default Layer;
