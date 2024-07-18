"use client";
import React, { useEffect, useState } from "react";
import { Button, SIZE } from "baseui/button";
import { loadFonts } from "@/utils/fonts";
import { Block } from "baseui/block";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import Image from "next/image";
import images from "public/images/index2";

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
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
  }
}

export default function Text() {
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);
  const token = checkTokenCookie();
  const [allText, setAllText] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    console.log(currentScene);

  };
  const addObject = async () => {
    if (editor) {
      const font = {
        name: "Open Sans",
        url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0C4nY1M2xLER.ttf",
      };
      await loadFonts([font]);
      console.log(loadFonts([font]))
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
        editor.objects.add(options);
      }
    }
  };
  const handleAddText = async (item) => {
    // if (editor) {
    //   console.log(item);
    //   const response = await axios.post(`${network}/addLayerText`, {
    //     idproduct: idProduct,
    //     token: token,
    //     text: item.content.text,
    //     color: item.content.color,
    //     size: 8,
    //     font: item.content.font,
    //     width: 20,
    //     page: Number(parseGraphicJSON()),
    //   });
    //   if (response && response.data) {
    //     const options = {
    //       id: response.data.data.id,
    //       type: "StaticText",
    //       width: 200,
    //       text: item.content.text,
    //       fontSize: 24,
    //       fontFamily: item.content.font,
    //       textAlign: "center",
    //       fontStyle: item.content.indam === "normal" ? "bold" : "400",
    //       fill: item.content.color,
    //       metadata: {
    //         page: Number(parseGraphicJSON()),
    //       },
    //     };
    //     editor.objects.add<(options);
    //   }
    // }
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
        
        console.log(res.data.data);
        setAllText(res?.data?.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getAllText();
  }, [network, token]);
  
  return (
    <>
      <Block className="absolute top-0 left-[100px] h-full w-[300px] pb-[65px] border-r border-gray-300 overflow-y-auto">
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
            <h4
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Kiểu chữ
            </h4>
          </Block>

          <Block
            $style={{ cursor: "pointer", display: "flex" }}
          >
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
                  onClick={() => handleAddText(text)}
                >
                  <p
                    style={{
                      color: text.content.color,
                      fontFamily: text.content.font,
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
          }}
        >
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

