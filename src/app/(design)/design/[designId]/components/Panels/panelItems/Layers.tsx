"use client";
import React, { useState } from "react";
import { useEditor, useObjects } from "@layerhub-io/react";
import { Block } from "baseui/block";
import AngleDoubleLeft from "../../../../../../../components/Icons/AngleDoubleLeft";
import Scrollable from "../../../../../../../components/Scrollable";
import { ILayer } from "@layerhub-io/types";
import Locked from "../../../../../../../components/Icons/Locked";
import Unlocked from "../../../../../../../components/Icons/Unlocked";
import Eye from "../../../../../../../components/Icons/Eye";
import EyeCrossed from "../../../../../../../components/Icons/EyeCrossed";
import Delete from "../../../../../../../components/Icons/Delete";
import { Button, KIND, SIZE } from "baseui/button";
import useSetIsSidebarOpen from "../../../../../../../hooks/useSetIsSidebarOpen";
import Lighting from "./setting.png";
import useAppContext from "../../../../../../../hooks/useAppContext";
import { REPLACE_METADATA } from "../../../../../../../redux/slices/variable/variableSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../hooks/hook";
import useDesignEditorContext from "../../../../../../../hooks/useDesignEditorContext";
import empty from "./empty.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { loadFonts } from "../../../../../../../utils/media/fonts";
import { FontItem } from "../../../../../../../interfaces/common";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

function checkTokenCookie() {
  var allCookies = document.cookie;

  var cookiesArray = allCookies.split("; ");

  var tokenCookie;
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i];
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0];
    var cookieValue = cookieParts[1];

    if (cookieName === "token") {
      tokenCookie = cookieValue;
      break;
    }
  }

  if (tokenCookie) {
    console.log('Giá trị của cookie "token" là:', tokenCookie);
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
    console.log('Không tìm thấy cookie có tên là "token"');
  }
}

export default function Layers() {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = React.useState<any[]>([]);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const [loading, setLoading] = React.useState(false);
  const { currentDesign, scenes } = useDesignEditorContext();
  // const token = useAppSelector((state) => state.token.token);
  const token = checkTokenCookie();
  const idProduct = useAppSelector((state: RootState) => state?.token?.id);

  const addObject = async () => {
    if (editor) {
      const font: FontItem = {
        name: "Helve",
        url: "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff",
      };
      await loadFonts([font]);
      console.log(font);
      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: idProduct,
        token: token,
        text: "Thêm chữ",
        color: "#333333",
        size: 92,
        font: font.name,
        page: Number(parseGraphicJSON()),
      });
      console.log(res.data);
      if (res.data.code === 1) {
        const options = {
          id: res.data.data.id,
          type: "StaticText",
          width: 420,
          text: "Thêm chữ",
          fontSize: 92,
          fontFamily: font.name,
          textAlign: "center",
          fontStyle: "normal",
          fontURL: font.url,
          fill: "#000000",
          metadata: {
            idBackground: 0,
            lock: false,
            page: Number(parseGraphicJSON()),

            // sort: 1,
            srcBackground: "",
            uppercase: "",
            variable: "",
            variableLabel: "",
          },
        };
        editor.objects.add<any>(options);
      }
    }
  };
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
  const editor = useEditor();
  const objects = useObjects() as ILayer[];
  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const { setActiveSubMenu } = useAppContext();

  const dispatch = useAppDispatch();
  const objectMetadata = (object: any) => {
    editor.objects.select(object.id);
    console.log(object);
    setActiveSubMenu("Landing");
    dispatch(REPLACE_METADATA(object.metadata));
  };
  React.useEffect(() => {
    if (objects) {
      setLayerObjects(objects);
    }
  }, [objects]);

  React.useEffect(() => {
    let watcher = async () => {
      if (objects) {
        setLayerObjects([...objects]);
      }
    };
    if (editor) {
      editor.on("history:changed", watcher);
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher);
      }
    };
  }, [editor, objects]);

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    console.log(currentScene);
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {
      const graphicTemplate: any = {
        id: currentDesign.id,
        type: "GRAPHIC",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      };

      let resultIndex = findIndexById(graphicTemplate.scenes, currentScene.id);
      console.log(resultIndex);

      return resultIndex;
    } else {
      console.log("NO CURRENT DESIGN");
    }
  };
  const handleDropFiles = async (files: FileList) => {
    setLoading(true);
    const file = files[0];
    const url = URL.createObjectURL(file);
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      setLoading(false);

      return;
    }

    const res = await axios.post(
      `${network}/addLayerImageAPI`,
      {
        idproduct: idProduct,
        token: token,
        file: file,
        page: Number(parseGraphicJSON()),
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res.data);
    console.log(file);
    console.log(idProduct);
    console.log(token);

    if (res.data.code === 1) {
      console.log(
        typeof (Number(res.data.data.content.page), res.data.data.content.page)
      );
      const upload = {
        id: res.data.data.id,
        url: res.data.data.content.banner,
        metadata: {
          brightness: 20,
          naturalWidth: res.data.data.content.naturalWidth,
          naturalHeight: res.data.data.content.naturalHeight,
          initialHeight: res.data.data.content.height,
          initialWidth: res.data.data.content.width,
          lock: false,
          variable: res.data.data.content.variable,
          variableLabel: res.data.data.content.variableLabel,
          page: Number(res.data.data.content.page),
        },
      };

      setUploads([...uploads, upload]);
      const options = {
        type: "StaticImage",
        src: res.data.data.content.banner,
        id: res.data.data.id,
        metadata: {
          brightness: 20,
          naturalWidth: res.data.data.content.naturalWidth,
          naturalHeight: res.data.data.content.naturalHeight,
          initialHeight: res.data.data.content.height,
          initialWidth: res.data.data.content.width,
          lock: false,
          variable: res.data.data.content.variable,
          variableLabel: res.data.data.content.variableLabel,
          page: Number(res.data.data.content.page),
        },
      };
      editor.objects.add(options);
      setLoading(false);
    }
  };

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!);
  };
  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}>
        <Block>
          <h3 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>Layers</h3>
        </Block>

        <Block
          onClick={() => setIsSidebarOpen(false)}
          $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          {layerObjects.length > 0 ? (
            layerObjects.map((object) => (
              <Block
                $style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px",
                  fontSize: "14px",
                  alignItems: "center",
                  cursor: "pointer",
                  ":hover": {
                    background: "rgb(245,246,247)",
                  },
                  paddingTop: "15px",
                }}
                key={object.id}
                onClick={() => editor.objects.select(object.id)}
                // onClick={() => console.log(object.metadata.variable !== "")}
              >
                {object.name === "StaticText" ? (
                  <Block
                    $style={{
                      cursor: "pointer",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "500",
                    }}
                    onClick={() => editor.objects.select(object.id)}>
                    {object.text}
                  </Block>
                ) : (
                  <img
                    src={object._element?.currentSrc}
                    alt="ảnh"
                    style={{
                      width: "auto",
                      height: 40,
                      maxWidth: "100px",
                      resize: "both",
                      border: "1px solid black",
                    }}
                    onClick={() => editor.objects.select(object.id)}
                  />
                )}
                <Block
                  $style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}>
                  {object?.metadata?.variable !== "" && (
                    <Button
                      kind={KIND.tertiary}
                      size={SIZE.mini}
                      onClick={() => objectMetadata(object)}
                      overrides={{
                        Root: {
                          style: {
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        },
                      }}>
                      <img
                        src="./setting.png"
                        style={{
                          width: 18,
                          height: 18,
                          paddingLeft: "4px",
                          paddingRight: "4px",
                          paddingTop: "2px",
                        }}
                        alt=""
                        onClick={() => objectMetadata(object)}
                      />
                    </Button>
                  )}
                  {object.locked ? (
                    <Button
                      kind={KIND.tertiary}
                      size={SIZE.mini}
                      onClick={() => editor.objects.unlock(object.id)}
                      overrides={{
                        Root: {
                          style: {
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        },
                      }}>
                      <Locked size={24} />
                    </Button>
                  ) : (
                    <Button
                      kind={KIND.tertiary}
                      size={SIZE.mini}
                      onClick={() => editor.objects.lock(object.id)}
                      overrides={{
                        Root: {
                          style: {
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        },
                      }}>
                      <Unlocked size={24} />
                    </Button>
                  )}

                  {object.visible ? (
                    <Button
                      kind={KIND.tertiary}
                      size={SIZE.mini}
                      onClick={() =>
                        editor.objects.update({ visible: false }, object.id)
                      }
                      overrides={{
                        Root: {
                          style: {
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        },
                      }}>
                      <Eye size={24} />
                    </Button>
                  ) : (
                    <Button
                      kind={KIND.tertiary}
                      size={SIZE.mini}
                      onClick={() =>
                        editor.objects.update({ visible: true }, object.id)
                      }
                      overrides={{
                        Root: {
                          style: {
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        },
                      }}>
                      <EyeCrossed size={24} />
                    </Button>
                  )}
                  {/* {} */}
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.mini}
                    onClick={() => editor.objects.remove(object.id)}
                    overrides={{
                      Root: {
                        style: {
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        },
                      },
                    }}>
                    <Delete size={24} />
                  </Button>
                </Block>
              </Block>
            ))
          ) : (
            <Block>
              <Block
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "5%",
                }}>
                <Button
                  onClick={addObject}
                  // onClick={() => console.log(allText)}
                  size={SIZE.compact}
                  overrides={{
                    Root: {
                      style: {
                        width: "100%",
                        marginRight: "5px",
                      },
                    },
                  }}>
                  Thêm chữ
                </Button>
                <Button
                  onClick={handleInputFileRefClick}
                  size={SIZE.compact}
                  overrides={{
                    Root: {
                      style: {
                        width: "100%",
                      },
                    },
                  }}>
                  Chọn từ máy tính
                </Button>
                <input
                  onChange={handleFileInput}
                  type="file"
                  id="file"
                  ref={inputFileRef}
                  style={{ display: "none" }}
                />
              </Block>
              <Block
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  paddingTop: "100%",
                }}>
                <Image alt="" src={empty} width={200} height={200} />
                <p
                  style={{
                    fontFamily: "Arial",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}>
                  Layer trống
                </p>
              </Block>
            </Block>
          )}
        </Block>
      </Scrollable>
    </Block>
  );
}
