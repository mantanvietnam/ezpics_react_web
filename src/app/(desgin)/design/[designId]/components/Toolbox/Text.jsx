"use client";
import React, { useEffect, useState } from "react";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import Image from "next/image";
import images from "public/images/index2";

async function loadFonts(fonts) {
  const styleElement = document.createElement("style");
  let fontFaceRules = "";

  fonts.forEach((font) => {
    fontFaceRules += `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.font_woff2}') format('woff2'),
             url('${font.font_woff}') format('woff'),
             url('${font.font_ttf}') format('truetype');
        font-weight: ${font.weight};
        font-style: ${font.style};
      }
    `;
  });

  styleElement.innerHTML = fontFaceRules;
  document.head.appendChild(styleElement);
}

async function fetchAllFonts() {
  try {
    const response = await axios.get("https://apis.ezpics.vn/apis/listFont");
    if (response.data.code === 1) {
      return response.data.data;
    } else {
      console.error("Failed to fetch fonts:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching fonts:", error);
    return [];
  }
}

function checkTokenCookie() {
  var allCookies = document.cookie;
  var cookiesArray = allCookies.split("; ");
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i];
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0];
    var cookieValue = cookieParts[1];
    if (cookieName === "token") {
      return cookieValue.replace(/^"|"$/g, "");
    }
  }
  return null;
}

export default function Text() {
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);
  const token = checkTokenCookie();
  const [allText, setAllText] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const fontsFromApi = await fetchAllFonts();
      setFonts(fontsFromApi);
      await loadFonts(fontsFromApi);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getAllText = async () => {
      try {
        const res = await axios.post(`${network}/listStyleTextAPI`, {
          token: token,
          page: 1,
          limit: 100,
        });
        setAllText(res?.data?.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getAllText();
  }, [network, token]);

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();
    console.log(currentScene);
  };

  const addObject = async () => {
    if (editor && fonts.length > 0) {
      const font = fonts[0];
      console.log("Adding text with font:", font);
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
        const options = {
          id: res.data.data.id,
          type: "StaticText",
          width: 420,
          text: "Thêm chữ",
          fontSize: 92,
          fontFamily: font.name,
          textAlign: "center",
          fill: "#000000",
          metadata: {
            idBackground: 0,
            lock: false,
            page: Number(parseGraphicJSON()),
          },
        };
        editor.objects.add(options);
      }
    }
  };

  const handleAddText = async (item) => {
    if (editor && fonts.length > 0) {
      const font = fonts.find((f) => f.name === item.content.font);
      if (font) {
        await loadFonts([font]);
        console.log("Adding text with font:", font);
        const res = await axios.post(`${network}/addLayerText`, {
          idproduct: idProduct,
          token: token,
          text: item.content.text,
          color: item.content.color,
          size: 8,
          font: item.content.font,
          width: 20,
          page: Number(parseGraphicJSON()),
        });
        if (res.data.code === 1) {
          const options = {
            id: res.data.data.id,
            type: "StaticText",
            width: 200,
            text: item.content.text,
            fontSize: 24,
            fontFamily: item.content.font,
            textAlign: "center",
            fontStyle: item.content.indam === "normal" ? "bold" : "400",
            fill: item.content.color,
            metadata: {
              page: Number(parseGraphicJSON()),
            },
          };
          editor.objects.add(options);
        }
      }
    }
  };

  return (
    <>
      <Block className="absolute top-0 left-[100px] h-full w-[300px] pb-[65px] overflow-y-auto">
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
            <h4
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                marginBottom: "10px",
                marginTop: "10px",
              }}>
              Kiểu chữ
            </h4>
          </Block>
        </Block>
        <div>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={addObject}
              style={{ marginBottom: "5px" }}
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
        </div>
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
            <Image
              style={{
                position: "absolute",
                top: "12%",
                left: "16%",
              }}
              alt=""
              width={40}
              height={40}
              src={images.logo}
            />
          </div>
        </div>
      )}
    </>
  );
}
