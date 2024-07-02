"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, SIZE } from "baseui/button";
import { useStyletron } from "styletron-react";
import { useEditor } from "@layerhub-io/react";
import { FontItem } from "@/interfaces/common";
import { loadFonts } from "@/utils/media/fonts";
import { Block } from "baseui/block";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";

import Scrollable from "@/components/Scrollable";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";

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

export default function Text() {
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);
  const token = checkTokenCookie();
  const [allText, setAllText] = useState<any[]>([]);
  const [css] = useStyletron();
  const [loading, setLoading] = React.useState(false);
  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
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
      console.log(graphicTemplate.scenes);
      console.log(currentScene.id);
      return resultIndex;

      // makeDownload(graphicTemplate);
      // const allLayers = graphicTemplate.scenes.map((scene:any) => scene.layers);
      // console.log(graphicTemplate)
      // const newDesign = generateToServer(allLayers);
      // console.log(newDesign)
      // let newArr : any=[];
      // console.log(newArr)
    } else {
      console.log("NO CURRENT DESIGN");
    }
  };
  const addObject = async () => {
    if (editor) {
      const font: FontItem = {
        name: "Open Sans",
        url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4nY1M2xLER.ttf",
      };
      await loadFonts([font]);
      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: idProduct,
        token: token,
        text: "Thêm chữ",
        color: "#333333",
        size: 92,
        font: font.name,
        page: Number(parseGraphicJSON()),
      });
      if (res.data.code === 1) {
        console.log(res.data);
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
  const handleAddText = async (item: any) => {
    if (editor) {
      // const font: FontItem = {
      //   name: "Helve",
      //   url: "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff",
      // };
      // await loadFonts([font]);
      console.log(item);
      const response = await axios.post(`${network}/addLayerText`, {
        idproduct: idProduct,
        token: token,
        text: item.content.text,
        color: item.content.color,
        size: 200,
        font: item.content.font,
        page: Number(parseGraphicJSON()),
      });
      if (response && response.data) {
        const options = {
          id: response.data.data.id,
          type: "StaticText",
          width: 1000,
          text: item.content.text,
          fontSize: 200,
          fontFamily: item.content.font,
          textAlign: "center",
          fontStyle: item.content.indam === "normal" ? "bold" : "400",
          // fontURL: font.url,
          fill: item.content.color,
          metadata: {
            page: Number(parseGraphicJSON()),
          },
        };
        editor.objects.add<any>(options);
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    const getAllText = async () => {
      try {
        const res = await axios.post(`${network}/listStyleTextAPI`, {
          token: token,
          page: 1,
          limit: 100,
        });
        console.log(res.data);

        if (res.data && res) {
          setAllText(res.data.data);
          setLoading(false);
        } else {
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      console.log(allText);
    };
    getAllText();
  }, []);

  const addComponent = async (component: any) => {
    if (editor) {
      const fontItemsList: FontItem[] = [];
      if (component.objects) {
        component.objects.forEach((object: any) => {
          if (object.type === "StaticText" || object.type === "DynamicText") {
            fontItemsList.push({
              name: object.fontFamily,
              url: object.fontURL,
            });
          }
        });
        const filteredFonts = fontItemsList.filter((f) => !!f.url);
        await loadFonts(filteredFonts);
      } else {
        if (
          component.type === "StaticText" ||
          component.type === "DynamicText"
        ) {
          fontItemsList.push({
            name: component.fontFamily,
            url: component.fontURL,
          });
          await loadFonts(fontItemsList);
        }
      }
      editor.objects.add(component);
    }
  };
  return (
    <>
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
            <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
              Kiểu chữ
            </h4>
          </Block>

          <Block
            onClick={() => setIsSidebarOpen(false)}
            $style={{ cursor: "pointer", display: "flex" }}>
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={addObject}
              // onClick={() => console.log(allText)}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}>
              Thêm chữ
            </Button>

            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}>
              {allText.map((text, index) => (
                <div
                  key={text.id}
                  style={{
                    height: 100,
                    border: "1px solid gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddText(text)}>
                  <p
                    style={{
                      color: text.content.color,
                      fontFamily: text.content.font,
                      textAlign: "center",
                      fontWeight:
                        text.content.indam === "normal" ? "bold" : "400",
                      fontSize: 25,
                    }}>
                    {text.content.text}
                  </p>
                </div>
              ))}
            </div>
          </Block>
        </Scrollable>
      </Block>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "absolute",
            zIndex: 20000000000,
          }}>
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
            <div className="ldio-4qpid53rus9">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            {/* <img
              style={{
                position: "absolute",
                top: "12%",
                left: "16%",
                width: 40,
                height: 40,
              }}
              src={image}
            /> */}
          </div>
        </div>
      )}
    </>
  );
}

interface TextComponent {
  id: string;
  metadata: {
    preview: string;
  };
}
function TextComponentItem({
  component,
  onClick,
}: {
  component: any;
  onClick: (option: any) => void;
}) {
  const [css] = useStyletron();
  return (
    <div
      onClick={() => onClick(component.layers[0])}
      className={css({
        position: "relative",
        height: "84px",
        background: "#f8f8fb",
        cursor: "pointer",
        padding: "12px",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}>
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}></div>
      <img
        src={component.preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  );
}
