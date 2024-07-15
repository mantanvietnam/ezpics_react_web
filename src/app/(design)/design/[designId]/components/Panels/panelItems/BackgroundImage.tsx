"use client";
import React, { useEffect, useState } from "react";
import { useEditor } from "@layerhub-io/react";
import { Block } from "baseui/block";
import Scrollable from "@/components/Scrollable";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import { useStyletron } from "baseui";
import { SAMPLE_TEMPLATES } from "@/constants/editor";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import useAppContext from "@/hooks/useAppContext";

export default function BackgroundImage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAppSelector((state) => state.token.token);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const { setActiveSubMenu } = useAppContext();
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

    // Kiểm tra nếu đã tìm thấy cookie "token"
    if (tokenCookie) {
      // console.log('Giá trị của cookie "token" là:', tokenCookie);
      return tokenCookie.replace(/^"|"$/g, "");
    } else {
      console.log('Không tìm thấy cookie có tên là "token"');
    }
  }
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.post<any>(`${network}/listIngredientAPI`, {
          token: checkTokenCookie(),
          limit: 100,
          keyword: "Ảnh nền",
        });
        setTemplates(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);
  const { currentDesign, scenes } = useDesignEditorContext();
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const { setCurrentScene, currentScene } = useDesignEditorContext();

  // const loadTemplate = React.useCallback(
  //   async (template: any) => {
  //     if (editor) {
  //       const fonts: any[] = [];
  //       template.layers.forEach((object: any) => {
  //         if (object.type === "StaticText" || object.type === "DynamicText") {
  //           fonts.push({
  //             name: object.fontFamily,
  //             url: object.fontURL,
  //             options: { style: "normal", weight: 400 },
  //           });
  //         } else if (object.type === "StaticImage") {
  //           const image = new Image();
  //           image.src = object.src;
  //           const brightnessValue = object.brightness;
  //           image.onload = () => {
  //                           image.style.filter = `-moz-filter: brightness(50%);`;

  //             image.style.filter = `brightness(${200}%)`;

  //             image.style.filter = `-webkit-filter: brightness(200%);`;

  //             console.log(image);
  //                                 image.style.borderRadius = '50%';

  //           };

  //         }
  //       });
  //       const filteredFonts = fonts.filter((f) => !!f.url);
  //       if (filteredFonts.length > 0) {
  //         await loadFonts(filteredFonts);
  //       }

  //       setCurrentScene({ ...template, id: currentScene?.id });
  //     }
  //   },
  //   [editor, currentScene]
  // );
  const addObject = React.useCallback(
    (url: string) => {
      if (editor) {
        console.log(url);

        var img = new Image();
        img.src = url;
        img.onload = function () {
          const options = {
            type: "StaticImage",
            src: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
            lock: false,
          };

          editor.objects.add(options);
          console.log(img.naturalWidth, img.naturalHeight);
        };
      }
    },
    [editor]
  );
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
  const [loading, setLoading] = React.useState(false);

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
  const idProduct = useAppSelector((state) => state.token.id);
  const handleImage = async (item: any) => {
    console.log(item);
    const res = await axios.post(
      `${network}/addLayerImageUrlAPI`,
      {
        idproduct: idProduct,
        token: checkTokenCookie(),
        imageUrl: item.image,
        page: Number(parseGraphicJSON()),
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
      console.log(options);
      editor.objects.add(options);
      setLoading(false);
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
          <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            Thành phần
          </h4>

          <Block
            onClick={() => setActiveSubMenu("Graphics")}
            $style={{ cursor: "pointer", display: "flex" }}>
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <div style={{ padding: "0 1.5rem" }}>
            <div
              style={{
                display: "flex",
                paddingBottom: "10px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                Ảnh nền
              </h4>
            </div>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}>
              {templates
                // .filter((item) => item.keyword === "Ảnh nền")
                .map((item, index) => (
                  <ImageItem
                    onClick={() => handleImage(item)}
                    key={index}
                    preview={`${item.image}`}
                  />
                ))}
            </div>
          </div>
        </Scrollable>
      </Block>
      {isLoading && (
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
            <img
              style={{
                position: "absolute",
                top: "12%",
                left: "16%",
                width: 40,
                height: 40,
              }}
              src="/images/EZPICS.png"
            />
          </div>
        </div>
      )}
    </>
  );
}

function ImageItem({
  preview,
  onClick,
}: {
  preview: any;
  onClick?: (option: any) => void;
}) {
  const [css] = useStyletron();
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
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
        src={preview}
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
