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

export default function Text() {
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);
  const token = useAppSelector((state) => state.token.token);
  const [allText, setAllText] = useState<any[]>([]);
  const [css] = useStyletron();
  const [loading, setLoading] = useState(false);
  const [fonts, setFonts] = useState<any[]>([]);
  const { currentDesign, scenes } = useDesignEditorContext();
  const textLayerRef = useRef<any>(null);

  const findIndexById = (arr: any, targetId: any) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1;
  };

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return scn;
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

      const resultIndex = findIndexById(
        graphicTemplate.scenes,
        currentScene.id
      );
      return { page: resultIndex, updatedScenes };
    } else {
      console.log("NO CURRENT DESIGN");
    }
  };

  const addObject = async () => {
    if (editor) {
      const { page, updatedScenes } = parseGraphicJSON();

      const fontURL =
        updatedScenes[page]?.layers.find((layer) => layer.type === "StaticText")
          ?.fontURL ||
        "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff";

      const font: FontItem = {
        name: "Helve",
        url: fontURL,
      };

      await loadFonts([font]);

      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: idProduct,
        token: token,
        text: "Thêm chữ",
        color: "#333333",
        size: 92,
        font: font.name,
        page,
      });

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
            page,
          },
        };
        const newTextLayer = editor.objects.add<any>(options);
        textLayerRef.current = newTextLayer;
      }
    }
  };

  const handleAddText = async (item: any) => {
    if (editor) {
      const { page, updatedScenes } = parseGraphicJSON();

      const fontURL =
        item.content.fontURL ||
        "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff";

      const font: FontItem = {
        name: item.content.font,
        url: fontURL,
      };

      await loadFonts([font]);

      const response = await axios.post(`${network}/addLayerText`, {
        idproduct: idProduct,
        token: token,
        text: item.content.text,
        color: item.content.color,
        size: 200,
        font: item.content.font,
        page,
      });

      if (response && response.data) {
        const options = {
          id: response.data.data?.id,
          type: "StaticText",
          width: 1000,
          text: item.content.text,
          fontSize: 200,
          fontFamily: item.content.font,
          textAlign: "center",
          fontStyle: item.content.indam === "normal" ? "bold" : "400",
          fill: item.content.color,
          metadata: {
            page,
          },
        };
        const newTextLayer = editor.objects.add<any>(options);
        textLayerRef.current = newTextLayer;
      }
    }
  };
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.post(`${network}/listFont`, {
          token: token,
        });

        const fontList = response.data.data.map((font: any) => ({
          name: font.name,
          url: font.font,
        }));

        setFonts(fontList);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };

    fetchFonts();
  }, [network, token]);

  useEffect(() => {
    if (fonts.length === 0) {
      return;
    }

    const fetchTextStyles = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${network}/listStyleTextAPI`, {
          token: token,
          page: 1,
          limit: 100,
        });

        if (res.data && res.data.data) {
          const allText = res.data.data;

          const updatedAllText = allText.map((text: any) => {
            const matchedFont = fonts.find(
              (font) => font.name === text.content.font
            );
            const fontURL = matchedFont
              ? matchedFont.url
              : "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff";
            return {
              ...text,
              content: {
                ...text.content,
                fontURL: fontURL || text.content.fontURL,
              },
            };
          });

          setAllText(updatedAllText);
        }
      } catch (error) {
        console.error("Error fetching text styles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTextStyles();
  }, [fonts, network, token]);

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
          }}
        >
          <Block>
            <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
              Kiểu chữ
            </h4>
          </Block>

          <Block
            onClick={() => setIsSidebarOpen(false)}
            $style={{ cursor: "pointer", display: "flex" }}
          >
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={addObject}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Thêm chữ
            </Button>

            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}
            >
              {allText.map((text) => (
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
                  onClick={() => handleAddText(text)}
                >
                  <p
                    style={{
                      color: text.content.color,
                      fontFamily: `"${text.content.font}", Arial, sans-serif`,
                      textAlign: "center",
                      fontWeight:
                        text.content.indam === "normal" ? "bold" : "400",
                      fontSize: 25,
                    }}
                  >
                    {text.content.text}
                  </p>
                </div>
              ))}
            </div>
          </Block>
        </Scrollable>
      </Block>
    </>
  );
}
