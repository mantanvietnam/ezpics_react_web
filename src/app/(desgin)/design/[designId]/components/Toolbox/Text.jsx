"use client";
import React, { useEffect, useState } from "react";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import Image from "next/image";
import images from "public/images/index2";
import { useSelector, useDispatch } from "react-redux";
import { addLayerImage } from "@/redux/slices/editor/stageSlice";
import "@/styles/loading.css";

async function LoadFonts(fonts) {
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

  const stageData = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const fontsFromApi = await fetchAllFonts();
      setFonts(fontsFromApi);
      await LoadFonts(fontsFromApi);
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

  const addObject = async () => {
    const defaultFont = {
      name: "Open Sans",
      url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4nY1M2xLER.ttf",
    };

    try {
      await LoadFonts([defaultFont]);

      const res = await axios.post(`${network}/addLayerText`, {
        idproduct: stageData.design.id,
        token: token,
        text: "Thêm chữ",
        color: "#333333",
        size: "10px",
        font: defaultFont.name,
      });

      if (res.data.code === 1) {
        dispatch(addLayerImage(res.data.data));
      } else {
        console.error("Failed to add text layer:", res.data);
      }
    } catch (error) {
      console.log("Error adding text layer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddText = async (item) => {
    const font = fonts.find((f) => f.name === item.content.font);
    if (font) {
      try {
        await LoadFonts([font]);
        const res = await axios.post(`${network}/addLayerText`, {
          idproduct: stageData.design.id,
          token: token,
          text: item.content.text,
          color: item.content.color,
          size: "8px",
          font: item.content.font,
        });
        dispatch(addLayerImage(res.data.data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Block
        className="absolute top-0 left-[108px] h-full w-[300px] pb-[65px] overflow-y-auto px-4"
        style={{ scrollbarWidth: "thin" }}>
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
              className="w-[100%] bg-black rounded-lg border border-transparent text-white px-4 py-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
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
              Thêm
            </Button>

            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}>
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
      </Block>
    </>
  );
}
