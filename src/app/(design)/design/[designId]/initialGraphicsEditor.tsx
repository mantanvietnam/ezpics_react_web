import Navbar from "../[designId]/components/Navbar";
import Panels from "./components/Panels";
import Canvas from "../[designId]/components/Canvas";
import Footer from "./components/Footer";
import Toolbox from "./components/Toolbox";
import EditorContainer from "../[designId]/components/EditorContainer";
import PresentationEditor from "./PresentationEditor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { useEditor } from "@layerhub-io/react";
import ezpiclogo from "./EZPICS.png";

import { IScene } from "@layerhub-io/types";
import { loadVideoEditorAssets } from "@/utils/media/video";
import { loadTemplateFonts } from "@/utils/media/fonts";
import { v4 as uuidv4 } from "uuid";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { loadFonts } from "@/utils/media/fonts";
import { toast } from "react-toastify";
import { REPLACE_TOKEN, REPLACE_ID_USER } from "@/redux/slices/token/reducers";
import "../../components/Resizable/loading.css";
import { REPLACE_font } from "@/redux/slices/font/fontSlice";
import "../../../src/views/DesignEditor/components/Preview/newestLoading.css";
import useAppContext from "@/hooks/useAppContext";
import { REPLACE_TYPE_USER } from "@/redux/slices/type/typeSlice";
import { REPLACE_PRO_USER } from "@/redux/slices/token/reducers";

function GraphicEditor() {
  const dispatch = useAppDispatch();
  const [commonFonts, setCommonFonts] = React.useState<any[]>([]);
  const [fontURLInitial, setFontURLInitial] = React.useState<string>("");
  const [errorMessage, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { setActiveSubMenu } = useAppContext();
  const typeUser = useAppSelector((state) => state.typeUser.typeUser);
  const {
    setCurrentScene,
    currentScene,
    scenes,
    currentDesign,
    setCurrentDesign,
  } = useDesignEditorContext();

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fontInitial = useAppSelector((state) => state.newFont.font);
  const handleLoadFont = async (x: any) => {
    if (editor) {
      let selectedFont;

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
        // @ts-ignore
      }
    }
  };
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
      console.log('Giá trị của cookie "token" là:', tokenCookie);
      return tokenCookie.replace(/^"|"$/g, "");
    } else {
      console.log('Không tìm thấy cookie có tên là "token"');
    }
  }
  const getDataFontTextInitial = async (fontInitial: any) => {
    //
    setLoading(true);
    try {
      const response = await axios.post(`${networkAPI}/listFont`, {
        token: checkTokenCookie(),
      });
      const data = response.data.data;
      setCommonFonts(data);
      dispatch(REPLACE_font(data));
      console.log(fontInitial);
      if (response.data.data) {
        response.data.data.map(function (font: any) {
          if (font.name.includes(fontInitial)) {
            setFontURLInitial(font.font_ttf);
            return fontURLInitial;
          }
        });
        setLoading(false);
      }
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
      // setError(true
      setLoading(false);
    }
  };
  const generateText = (id: string, detail: any) => {
    getDataFontTextInitial(detail.content.font);
    return {
      id: uuidv4(),
      name: "StaticText",
      angle: 0,
      stroke: null,
      strokeWidth: 0,
      left: detail.content.postion_left,
      top: detail.content.postion_top,
      opacity: 1,
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
      type: "StaticText",
      flipX: false,
      flipY: false,
      skewX: 0,
      skewY: 0,
      visible: true,
      shadow: null,
      charSpacing: 0,
      fill: detail.content.color,
      fontFamily: detail.content.font,
      fontSize: 80,
      lineHeight: 1.16,
      text: detail.content.text,
      textAlign: "center",
      fontURL: fontURLInitial,
      metadata: {},
    };
  };

  const generateImage = (id: string, detail: any) => {
    return {
      id: uuidv4(),
      name: "StaticImage",
      angle: 0,
      stroke: null,
      strokeWidth: 0,
      left: detail.content.postion_left,
      top: detail.content.postion_top,
      // width: 926,
      // height: 1003,
      opacity: 1,
      originX: "left",
      originY: "top",
      scaleX: 0.36,
      scaleY: 0.36,
      type: "StaticImage",
      flipX: false,
      flipY: false,
      skewX: 0,
      skewY: 0,
      visible: true,
      shadow: null,
      src: detail.content.banner,
      cropX: 0,
      cropY: 0,
      metadata: {
        variable: "",
        variableLabel: "",
      },
    };
  };

  const editor = useEditor();
  const [dataRes, setDataRes] = useState<any>(null);
  const loadGraphicTemplate = async (payload: any) => {
    const scenes = [];
    // const { scenes: scns, ...design } = payload;
    const scns = payload.scenes;
    console.log(payload);
    for (const scn of scns) {
      const scene: IScene = {
        name: payload.name,
        frame: payload.frame,
        id: payload.id,
        layers: scn.layers,
        metadata: {},
      };

      const loadedScene = await loadVideoEditorAssets(scene);
      await loadTemplateFonts(loadedScene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      scenes.push({ ...loadedScene, preview });
    }

    return { scenes };
  };

  const dataFunction = (data: any) => {
    const dataString = {
      id: uuidv4(),
      name: "Untitled Design",
      frame: {
        width: data.width,
        height: data.height,
      },
      layers: [
        {
          id: "background",
          name: "Initial Frame",
          angle: 0,
          stroke: null,
          strokeWidth: 0,
          // left: 0,
          // top: 0,
          // width: data.width,
          // height: data.height,
          opacity: 1,
          originX: "left",
          originY: "top",
          scaleX: 1,
          scaleY: 1,
          type: "Background",
          flipX: false,
          flipY: false,
          skewX: 0,
          skewY: 0,
          visible: true,
          shadow: {
            color: "#fcfcfc",
            blur: 4,
            offsetX: 0,
            offsetY: 0,
            affectStroke: false,
            nonScaling: false,
          },
          fill: "#FFFFFF",
          metadata: {
            lock: false,
            variable: "",
            variableLabel: "",
            uppercase: "",
            sort: 0,
          },
        },
        {
          id: data.id,
          name: "StaticImage",
          angle: 0,
          stroke: null,
          strokeWidth: 0,
          // left: 0,
          // top: 0,
          // width: data.width,
          // height: data.height,
          opacity: 1,
          originX: "left",
          originY: "top",
          scaleX: 1,
          scaleY: 1,
          type: "StaticImage",
          flipX: false,
          flipY: false,
          brightness: 0,
          borderRadius: 0,
          skewX: 0,
          skewY: 0,
          visible: true,
          shadow: null,
          src: data.thumn,
          cropX: 0,
          cropY: 0,
          image_svg: "",
          metadata: {
            brightness: 20,
            naturalWidth: 0,
            naturalHeight: 0,
            initialHeight: 0,
            initialWidth: 0,
            lock: false,
            variable: "",
            variableLabel: "",
            sort: 0,
            page: 0,
          },
        },
      ],

      metadata: {},
      preview: "",
    };

    if (data.productDetail) {
      data.productDetail.forEach(async (detail: any, index: number) => {
        if (detail.content.type == "text") {
          // getDataFontTextInitial()
          // console.log(detail);
          let stringMerged;
          stringMerged = detail.content.text.replace(/<br\s*\/>/g, "\n");
          dataString.layers.push({
            id: detail.id,
            name: "StaticText",
            angle: 0,
            stroke: null,
            strokeWidth: 0,
            left: (detail.content.postion_left / 100) * data.width,
            top: (detail.content.postion_top / 100) * data.height,
            opacity: detail.content.opacity,
            originX: "left",
            originY: "top",
            // scaleX: (parseInt(detail.content.width, 10) / data.width) * 100,
            // scaleY: (parseInt(detail.content.width, 10) / data.width) * 100,
            type: "StaticText",
            flipX: false,
            flipY: false,
            skewX: 0,
            skewY: 0,
            visible: true,
            shadow: null,
            charSpacing: 0,
            fill:
              detail.content.gradient === 1
                ? detail.content.gradient_color[0]?.color
                : detail.content.color,
            // fill: 'white',
            width:
              (parseInt(detail.content.width.replace(/vw/g, "")) * data.width) /
              100,
            // height: null,
            // fontFamily: detail.content.font,
            fontFamily: detail.content.font,
            fontSize:
              (parseInt(detail.content.size.replace(/vw/g, "")) * data.width) /
              100,
            // (parseInt(detail.content.width, 10) / data.width) * 10000
            lineHeight: parseInt(detail.content.gianchu),
            text: stringMerged,
            textAlign: detail.content.text_align,
            // fontURL: "https://apis.ezpics.vn/upload/admin/files/UTM%20AvoBold.ttf",
            // fontURLInitial
            metadata: {
              page: detail.content.page,
              lock: detail.content.lock === 0 ? false : true,
              variable: detail.content.variable,
              variableLabel: detail.content.variableLabel,
              uppercase: detail.content.typeShowTextVariable,
              sort: detail.content.sort,
            },
          });
        } else if (detail.content.type == "image") {
          // getMeta(detail.content.banner).then((img) => {
          //   if (img.naturalHeight && img.naturalWidth) {
          // console.log(detail);

          dataString.layers.push({
            id: detail.id,
            name: "StaticImage",
            angle: 0,
            stroke: null,
            strokeWidth: 0,
            left: (detail.content.postion_left / 100) * data.width,
            top: (detail.content.postion_top / 100) * data.height,
            opacity: detail.content.opacity,
            originX: "left",
            originY: "top",
            scaleX:
              (parseInt(detail.content.width.replace(/vw/g, "")) * data.width) /
              100 /
              detail.content.naturalWidth,
            // img.naturalWidth,
            scaleY:
              (parseInt(detail.content.width.replace(/vw/g, "")) * data.width) /
              100 /
              detail.content.naturalWidth,
            // img.naturalWidth,
            // data.width,
            type: "StaticImage",
            flipX: detail.content.lat_anh,
            flipY: false,
            skewX: 0,
            skewY: 0,
            visible: true,
            shadow: null,
            src: detail.content.banner,
            cropX: 0,
            cropY: 0,
            image_svg: "",
            metadata: {
              page: detail.content.page,

              naturalWidth: detail.content.naturalWidth,
              naturalHeight: detail.content.naturalHeight,
              initialHeight: detail.content.height,
              initialWidth: detail.content.width,
              lock: detail.content.lock ? false : true,
              variable: detail.content.variable,
              variableLabel: detail.content.variableLabel,
              brightness: 0,
              sort: detail.sort,
            },
          });
        }
      });
    }
    console.log(dataString);

    return dataString;
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = checkTokenCookie();
  const id = useAppSelector((state) => state.token.id);
  if (token && id) {
    dispatch(REPLACE_TOKEN(token));
    dispatch(REPLACE_ID_USER(id));
  }

  const networkAPI = useAppSelector((state) => state.network.ipv4Address);
  const loadTemplate = React.useCallback(
    async (template: any) => {
      if (editor) {
        const fonts: any[] = [];
        template.layers.forEach((object: any) => {
          if (object.type === "StaticText") {
            fonts.push({
              name: object.fontFamily,
              url: object.fontURL,
              // options: { style: "normal", weight: 400 },
            });
          }
        });
        setCurrentScene({ ...template, id: currentScene?.id });
      }
    },
    // editor,
    [scenes, currentScene, currentDesign]
  );

  let convertData;
  const currentListFont = useAppSelector((state) => state.newFont.font);
  useEffect(() => {
    const fetchProUser = async () => {
      try {
        const response = await axios.post(`${networkAPI}/getInfoMemberAPI`, {
          token: checkTokenCookie(),
        });
        if (response.data.data) {
          console.log(scenes);

          dispatch(
            REPLACE_PRO_USER(
              response.data?.data?.member_pro === 1 ? true : false
            )
          );
        }
      } catch (error) {
        toast.error("Lỗi lấy thông tin khách hàng", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
      }
    };

    fetchProUser();
  }, []);
  useEffect(() => {
    const fetchDataBanks = async () => {
      try {
        const data = {
          idproduct: id,
          token: checkTokenCookie(),
        };

        const response = await axios.post(`${networkAPI}/listLayerAPI`, data);

        if (response && response.data.code === 1) {
          setDataRes(response.data.data);
          console.log(response.data.data);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Không định danh được người dùng, hãy đăng nhập lại", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setError(true);
        setLoading(false);
      }
    };
    fetchDataBanks();
  }, []);
  useEffect(() => {
    setActiveSubMenu("FontSelector");
  }, []);
  useEffect(() => {
    if (errorMessage) {
      setLoading(false);
    }
  });
  useEffect(() => {
    const fetchDataBanks = async () => {
      setLoading(true);
      try {
        console.log(dataRes);
        dispatch(REPLACE_TYPE_USER(dataRes?.type));

        const dataRender = dataFunction(dataRes);
        await loadGraphicTemplate(dataRender);
        // await loadTemplate(dataRender);

        setTimeout(() => {
          setLoading(false);
          setActiveSubMenu("Layers");
          console.log(currentListFont);
        }, 4000);

        // //   @ts-ignore
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchDataBanks();
  }, [dataRes]);

  return (
    <>
      <EditorContainer>
        <Navbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Panels />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Toolbox />
            <Canvas />
            <Footer />
          </div>
        </div>
        {(token === null || id === null || errorMessage) && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src="../../../assets/error.jpg"
              alt="lỗi"
              width={300}
              height={300}
              style={{ alignSelf: "center" }}
            />
            <h2
              style={{
                color: "black",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              Bạn không có quyền truy cập, hãy thử lại
            </h2>
          </div>
        )}
        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.9)",
              position: "absolute",
              zIndex: 20000000000,
            }}
          >
            <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
              <div className="ldio-4qpid53rus92">
                <div></div>
                <div>
                  <div></div>
                </div>
                <img
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "16%",
                  }}
                  src="./EZPICS.png"
                />
              </div>
            </div>
          </div>
        )}
      </EditorContainer>
    </>
  );
}

export default GraphicEditor;

// layers: [
//         {
//           id: "background",
//           name: "Initial Frame",
//           angle: 0,
//           stroke: null,
//           strokeWidth: 0,
//           // left: 0,
//           // top: 0,
//           // width: data.width,
//           // height: data.height,
//           opacity: 1,
//           originX: "left",
//           originY: "top",
//           scaleX: 1,
//           scaleY: 1,
//           type: "Background",
//           flipX: false,
//           flipY: false,
//           skewX: 0,
//           skewY: 0,
//           visible: true,
//           shadow: {
//             color: "#fcfcfc",
//             blur: 4,
//             offsetX: 0,
//             offsetY: 0,
//             affectStroke: false,
//             nonScaling: false,
//           },
//           fill: "#FFFFFF",
//           metadata: {
//             lock: false,
//             variable: "",
//             variableLabel: "",
//             uppercase: "",
//             sort: 0,
//           },
//         },
//         {
//           id: data.id,
//           name: "StaticImage",
//           angle: 0,
//           stroke: null,
//           strokeWidth: 0,
//           // left: 0,
//           // top: 0,
//           // width: data.width,
//           // height: data.height,
//           opacity: 1,
//           originX: "left",
//           originY: "top",
//           scaleX: 1,
//           scaleY: 1,
//           type: "StaticImage",
//           flipX: false,
//           flipY: false,
//           brightness: 0,
//           borderRadius: 0,
//           skewX: 0,
//           skewY: 0,
//           visible: true,
//           shadow: null,
//           src: data.thumn,
//           cropX: 0,
//           cropY: 0,
//           image_svg: "",
//           metadata: {
//             brightness: 20,
//             naturalWidth: 0,
//             naturalHeight: 0,
//             initialHeight: 0,
//             initialWidth: 0,
//             lock: false,
//             variable: "",
//             variableLabel: "",
//             sort: 0,
//             page: 0
//           },
//         },
//       ],

//       metadata: {},
//       preview: "",
//     };

//     if (data.productDetail) {
//       data.productDetail.forEach(
//         async (detail: any, index: number) => {
//           if (detail.content.type == "text") {
//             // getDataFontTextInitial()
//             // console.log(detail);
//             let stringMerged;
//             stringMerged = detail.content.text.replace(/<br\s*\/>/g, "\n");
//             dataString.layers.push({
//               id: detail.id,
//               name: "StaticText",
//               angle: 0,
//               stroke: null,
//               strokeWidth: 0,
//               left: (detail.content.postion_left / 100) * data.width,
//               top: (detail.content.postion_top / 100) * data.height,
//               opacity: detail.content.opacity,
//               originX: "left",
//               originY: "top",
//               // scaleX: (parseInt(detail.content.width, 10) / data.width) * 100,
//               // scaleY: (parseInt(detail.content.width, 10) / data.width) * 100,
//               type: "StaticText",
//               flipX: false,
//               flipY: false,
//               skewX: 0,
//               skewY: 0,
//               visible: true,
//               shadow: null,
//               charSpacing: 0,
//               fill:
//                 detail.content.gradient === 1
//                   ? detail.content.gradient_color[0]?.color
//                   : detail.content.color,
//               // fill: 'white',
//               width:
//                 (parseInt(detail.content.width.replace(/vw/g, "")) *
//                   data.width) /
//                 100,
//               // height: null,
//               // fontFamily: detail.content.font,
//               fontFamily: detail.content.font,
//               fontSize:
//                 (parseInt(detail.content.size.replace(/vw/g, "")) *
//                   data.width) /
//                 100,
//               // (parseInt(detail.content.width, 10) / data.width) * 10000
//               lineHeight: parseInt(detail.content.gianchu),
//               text: stringMerged,
//               textAlign: detail.content.text_align,
//               // fontURL: "https://apis.ezpics.vn/upload/admin/files/UTM%20AvoBold.ttf",
//               // fontURLInitial
//               metadata: {
//                 page: detail.content.page,
//                 lock: detail.content.lock === 0 ? false : true,
//                 variable: detail.content.variable,
//                 variableLabel: detail.content.variableLabel,
//                 uppercase: detail.content.typeShowTextVariable,
//                 sort: detail.content.sort,
//               },
//             });
//           } else if (detail.content.type == "image") {
//             // getMeta(detail.content.banner).then((img) => {
//             //   if (img.naturalHeight && img.naturalWidth) {
//             // console.log(detail);

//             dataString.layers.push({
//               id: detail.id,
//               name: "StaticImage",
//               angle: 0,
//               stroke: null,
//               strokeWidth: 0,
//               left: (detail.content.postion_left / 100) * data.width,
//               top: (detail.content.postion_top / 100) * data.height,
//               opacity: detail.content.opacity,
//               originX: "left",
//               originY: "top",
//               scaleX:
//                 (parseInt(detail.content.width.replace(/vw/g, "")) *
//                   data.width) /
//                 100 /
//                 detail.content.naturalWidth,
//               // img.naturalWidth,
//               scaleY:
//                 (parseInt(detail.content.width.replace(/vw/g, "")) *
//                   data.width) /
//                 100 /
//                 detail.content.naturalWidth,
//               // img.naturalWidth,
//               // data.width,
//               type: "StaticImage",
//               flipX: detail.content.lat_anh,
//               flipY: false,
//               skewX: 0,
//               skewY: 0,
//               visible: true,
//               shadow: null,
//               src: detail.content.banner,
//               cropX: 0,
//               cropY: 0,
//               image_svg: "",
//               metadata: {
//                                 page: detail.content.page,

//                 naturalWidth: detail.content.naturalWidth,
//                 naturalHeight: detail.content.naturalHeight,
//                 initialHeight: detail.content.height,
//                 initialWidth: detail.content.width,
//                 lock: detail.content.lock ? false : true,
//                 variable: detail.content.variable,
//                 variableLabel: detail.content.variableLabel,
//                 brightness: 0,
//                 sort: detail.sort,
//               },
//             });
//           }
//         }

//       );
//     }
//     console.log(dataString);

//     return dataString;
