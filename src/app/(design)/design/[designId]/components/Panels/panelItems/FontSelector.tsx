"use client";
import React, { useEffect } from "react";
import ArrowBackOutline from "../../../../../../../components/Icons/ArrowBackOutline";
import Search from "../../../../../../../components/Icons/Search";
import { Input, SIZE } from "baseui/input";
import useAppContext from "../../../../../../../hooks/useAppContext";
import { useStyletron } from "baseui";
import { IStaticText } from "@layerhub-io/types";
import { useEditor } from "@layerhub-io/react";
import { loadFonts } from "../../../../../../../utils/media/fonts";
import Scrollable from "../../../../../../../components/Scrollable";

import { Block } from "baseui/block";
import AngleDoubleLeft from "../../../../../../../components/Icons/AngleDoubleLeft";
import useSetIsSidebarOpen from "../../../../../../../hooks/useSetIsSidebarOpen";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../../hooks/hook";
import { REPLACE_font } from "../../../../../../../redux/slices/font/fontSlice";
import Image from "next/image";
import ezlogo from "./EZPICS (converted)-03.png";
import { FontItem } from "@/interfaces/common";

export default function FontSelector() {
  const [query, setQuery] = React.useState("");
  const { setActiveSubMenu } = useAppContext();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const dispatch = useAppDispatch();
  const [commonFonts, setCommonFonts] = React.useState<any[]>([]);
  const [loadedFonts, setLoadedFonts] = React.useState<any[]>([]);
  const [searchedFonts, setSearchedFonts] = React.useState(commonFonts);
  const token = useAppSelector((state) => state.token.token);
  const [css] = useStyletron();
  const editor = useEditor();
  const networkAPI = useAppSelector((state) => state.network.ipv4Address);
  const listFont = useAppSelector((state) => state.newFont.font);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchFonts = async () => {
      console.log(networkAPI);
      setIsLoading(true);
      try {
        const response = await axios.post(`${networkAPI}/listFont`, {
          token: token,
        });
        const data = response.data.data;
        if (data) {
          setCommonFonts(data);
          dispatch(REPLACE_font(data));
          response.data.data.map(async (font: any) => {
            handleLoadFont(font);
          });
          setIsLoading(false);
        }
        // console.log(response);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        // if (commonFonts.length > 0) {
        //   commonFonts.map(async (font) => {
        //     handleLoadFont(font);
        //   });
        //   console.log(data);
        // }
      } catch (error) {
        console.error("Error fetching fonts:", error);
        toast.error("Lỗi tìm nạp phông chữ, hãy thử lại", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
      }
    };

    fetchFonts();
  }, []);

  const handleFontFamilyChange = async (x: any) => {
    if (editor) {
      let selectedFont;

      if (x.font) {
        selectedFont = x.font;
      } else if (x.font_ttf) {
        selectedFont = x.font_ttf;
      } else if (x.font_otf) {
        selectedFont = x.font_otf;
      } else if (x.font_woff) {
        selectedFont = x.font_woff;
      } else if (x.font_woff2) {
        selectedFont = x.font_woff2;
      }
      const font = {
        name: x.name,
        url: selectedFont,
      };
      console.log(font);
      await loadFonts([font]);
      // @ts-ignore
      editor.objects.update<IStaticText>({
        fontFamily: font.name,
        fontURL: font.url,
      });
    }
  };
  const handleLoadFont = async (x: any) => {
    if (editor) {
      let selectedFont: FontItem | undefined;

      if (x.font) {
        selectedFont = {
          name: x.name,
          url: x.font,
        };
      } else if (x.font_woff) {
        selectedFont = {
          name: x.name,
          url: x.font_woff,
        };
      } else if (x.font_woff2) {
        selectedFont = {
          name: x.name,
          url: x.font_woff2,
        };
      } else if (x.font_otf) {
        selectedFont = {
          name: x.name,
          url: x.font_otf,
        };
      } else if (x.font_ttf) {
        selectedFont = {
          name: x.name,
          url: x.font_ttf,
        };
      }
      if (selectedFont) {
        await loadFonts([selectedFont]);
      }
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
            padding: "1.5rem",
          }}
        >
          <Block
            $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            onClick={() => setActiveSubMenu("Text")}
          >
            <ArrowBackOutline size={24} />
            <Block>Chọn kiểu chữ</Block>
          </Block>
          <Block
            onClick={() => setIsSidebarOpen(false)}
            $style={{ cursor: "pointer", display: "flex" }}
          >
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Block $style={{ padding: "0 1.5rem 1rem" }}>
          <Input
            overrides={{
              Root: {
                style: {
                  paddingLeft: "8px",
                },
              },
            }}
            clearable
            onChange={(e) => setQuery((e.target as any).value)}
            placeholder="Tìm kiếm"
            size={SIZE.compact}
            startEnhancer={<Search size={16} />}
          />
        </Block>
        <Scrollable>
          <div style={{ padding: "0 1.5rem", display: "grid", gap: "0.2rem" }}>
            {commonFonts.map((font, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleFontFamilyChange(font)}
                  className={css({
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    paddingBottom: "10px",
                    ":hover": {
                      backgroundColor: "rgb(245,246,247)",
                    },
                  })}
                  id={font.id}
                >
                  <h3
                    // className={css({

                    // })}
                    style={{
                      fontFamily: font.name, // Use useFont here
                      fontWeight: font.weight,
                    }}
                  >
                    {font.name} - Dùng là thích
                  </h3>
                  {/* {font.} */}
                </div>
              );
            })}
          </div>
        </Scrollable>
      </Block>
      {isLoading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            // backgroundColor: "rgba(0,0,0,0.1)",
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
              width={40}
              height={40}
              alt=""
              src={ezlogo}
            />
          </div>
        </div>
      )}
    </>
  );
}
