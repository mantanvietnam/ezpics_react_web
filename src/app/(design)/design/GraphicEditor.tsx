import Navbar from "./components/Navbar";
import Panels from "./components/Panels";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import Toolbox from "./components/Toolbox";
import EditorContainer from "./components/EditorContainer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { useEditor } from "@layerhub-io/react";
import { IDesign } from "@/interfaces/DesignEditor";
import { IScene } from "@layerhub-io/types";
import { loadVideoEditorAssets } from "@/utils/media/video";
import { v4 as uuidv4 } from "uuid";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { loadFonts } from "@/utils/media/fonts";
import { toast } from "react-toastify";
import { REPLACE_TOKEN, REPLACE_ID_USER } from "@/store/slices/token/reducers";
import "@/components/Resizable";
import { REPLACE_font } from "@/store/slices/font/fontSlice";
import "@/components/Preview/newestLoading.css";
import useAppContext from "@/hooks/useAppContext";
import { REPLACE_TYPE_USER } from "@/store/slices/type/typeSlice";
import { REPLACE_PRO_USER } from "@/store/slices/token/reducers";
import { useLocation } from "react-router-dom";
import ezpiclogo from "./EZPICS (converted)-03.png";

function GraphicEditor() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [fontURLInitial, setFontURLInitial] = React.useState<string>("");
  const [errorMessage, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [commonFonts, setCommonFonts] = React.useState<any[]>([]);
  const { setActiveSubMenu } = useAppContext();
  const typeUser = useAppSelector((state) => state?.typeUser?.typeUser);
  const [modalUserSeries, setModalUserSeries] = React.useState<boolean>(false);
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
  const styleModalBuyingFree = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: "15px",

    borderRadius: "15px",
  };
  const {
    setCurrentScene,
    currentScene,
    scenes,
    currentDesign,
    setScenes,
    setCurrentDesign,
  } = useDesignEditorContext();

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fontInitial = useAppSelector((state) => state.newFont.font);
  const [loadingBuyingFunc, setLoadingBuyingFunc] = React.useState(false);

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
      // setError(true
      setLoading(false);
    }
  };

  const editor = useEditor();
  const [dataRes, setDataRes] = useState<any>(null);
  const loadGraphicTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;
    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
      };

      const loadedScene = await loadVideoEditorAssets(scene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      scenes.push({ ...loadedScene, preview });
    }

    return { scenes, design };
  };
  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      let template;
      // const { scenes: scns, ...design } = data;

      template = await loadGraphicTemplate(data);
      //   @ts-ignore
      setScenes(template.scenes);
      //   @ts-ignore
      setCurrentDesign(template.design);
    },
    [editor]
  );
  const parseData = (data: any) => {
    return {
      type: "linear",
      coords: {
        x1: 32.85079999999999,
        y1: -136,
        x2: -31.57080000000002,
        y2: 136.1492,
      },
      colorStops: [
        { offset: 0, color: data.gradient_color[0].color },
        { offset: 1, color: data.gradient_color[1].color },
      ],
      offsetX: 0,
      offsetY: 0,
    };
  };
  const dataFunction = (data: any) => {
    const dataString = {
      frame: { initialWidth: data.width, initialHeight: data.height },
      content: [] as any,
    };

    data.productDetail.forEach(async (detail: any, index: number) => {
      if (detail.content.type == "text") {
        let stringMerged;
        stringMerged = detail.content.text.replace(/<br\s*\/>/g, "\n");
        dataString.content.push({
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
              ? parseData(detail.content)
              : detail.content.color,
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
          metadata: {
            backgroundLayer: false,

            lock: detail.content.lock === 0 ? false : true,
            variable: detail.content.variable,
            variableLabel: detail.content.variableLabel,
            uppercase: detail.content.typeShowTextVariable,
            sort: detail.sort,
            page: detail.content.page,
            srcBackground: data.thumn,
            idBackground: data?.id,
          },
        });
      } else if (detail.content.type == "image") {
        dataString.content.push({
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
            backgroundLayer: false,

            naturalWidth: detail.content.naturalWidth,
            naturalHeight: detail.content.naturalHeight,
            initialHeight: detail.content.height,
            initialWidth: detail.content.width,
            lock: detail.content.lock ? false : true,
            variable: detail.content.variable,
            variableLabel: detail.content.variableLabel,
            brightness: 0,
            sort: detail.sort,
            page: detail.content.page,
            srcBackground: data?.thumn,
            idBackground: data?.id,
          },
        });
      }
    });

    return dataString;
  };
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const { id, token } = location.state;

  if (token && id) {
    dispatch(REPLACE_TOKEN(token));
    dispatch(REPLACE_ID_USER(id));
  }

  const dataScenes = (data: any, dataBackground: any) => {
    const dataString = {
      id: uuidv4(),
      name: "Untitled Design",
      frame: {
        width: data.frame.initialWidth,
        height: data.frame.initialHeight,
      },
      scenes: [] as any[], // Explicitly define the type here
      metadata: {},
      preview: "",
      type: "GRAPHIC",
    };
    console.log(data.content[0]?.metadata?.idBackground);
    console.log(data);

    if (data?.content && data.content.length > 0) {
      console.log("chạy vào 1");

      const maxPage = Math.max(
        ...data.content.map(
          (detail: any) => (detail.metadata.page as number) || 0
        )
      );

      const scenesArray: any[] = Array.from(
        { length: maxPage + 1 },
        (_, index) => {
          const matchingDetails = data.content.filter(
            (detail: any) => Number(detail.metadata.page) === index
          );
          const updatedMatchingDetails = [
            {
              id: "background",
              name: "Initial Frame",
              angle: 0,
              stroke: null,
              strokeWidth: 0,
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
              id: data.content[0]?.metadata?.idBackground,
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
              src: data.content[0]?.metadata?.srcBackground,
              cropX: 0,
              cropY: 0,
              image_svg: "",
              metadata: {
                backgroundLayer: true,
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
            ...matchingDetails,
          ];

          return updatedMatchingDetails.length > 0
            ? {
                id: uuidv4(),
                layers: updatedMatchingDetails,
                name: "Untitled Design",
              }
            : null;
        }
      );

      dataString.scenes = scenesArray.filter((scene) => scene !== null);
    } else {
      console.log("chạy vào đây");
      const maxPage2 = 0;

      const scenesArray2: any[] = Array.from(
        { length: maxPage2 + 1 },
        (_, index) => {
          const matchingDetails2 = data.content.filter(
            (detail: any) => Number(detail.metadata.page) === index
          );

          const updatedMatchingDetails2 = [
            {
              id: "background",
              name: "Initial Frame",
              angle: 0,
              stroke: null,
              strokeWidth: 0,
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
              id: dataBackground.id,
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
              src: dataBackground.thumn,
              cropX: 0,
              cropY: 0,
              image_svg: "",
              metadata: {
                backgroundLayer: false,
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
            ...matchingDetails2,
          ];

          return {
            id: uuidv4(),
            layers: updatedMatchingDetails2,
            name: "Untitled Design",
          };
        }
      );

      dataString.scenes = scenesArray2.filter((scene) => scene !== null);
    }
    dataString.scenes.forEach((data, index) => {
      let shouldRemove = false; // Biến cờ để xác định xem có nên xóa hay không

      if (index > 0) {
        if (data.layers[1].metadata.backgroundLayer) {
          shouldRemove = true;
        }
      } else {
        console.log(data + " vế phụ");
      }

      // Xóa phần tử nếu biến cờ là true
      if (shouldRemove) {
        data.layers.splice(1, 1);
      }
    });

    return dataString;
  };

  const networkAPI = useAppSelector((state) => state?.network?.ipv4Address);
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
  const currentListFont = useAppSelector((state) => state?.newFont?.font);
  useEffect(() => {
    const fetchProUser = async () => {
      try {
        const response = await axios.post(`${networkAPI}/getInfoMemberAPI`, {
          token: checkTokenCookie(),
        });
        if (response.data.data) {
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
          idproduct: parseInt(id),
          token: checkTokenCookie(),
        };

        const response = await axios.post(`${networkAPI}/listLayerAPI`, data);

        if (response && response.data.code === 1) {
          setDataRes(response.data.data);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Không lấy được dữ liệu, hãy thử lại", {
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
        dispatch(REPLACE_TYPE_USER(dataRes?.type));

        if (dataRes) {
          const dataRender = dataFunction(dataRes);
          if (dataRender) {
            const dataSceneImport = dataScenes(dataRender, dataRes);
            if (dataSceneImport) {
              console.log(dataSceneImport);
              await handleImportTemplate(dataSceneImport);
            }
            setTimeout(() => {
              setLoading(false);

              setActiveSubMenu("Layers");
              if (dataRes?.type === "user_series") {
                // setModalUserSeries(true);
              }
            }, 4000);
          }
        }

        // //   @ts-ignore
      } catch (error) {
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
              style={{ width: 300, height: 300, alignSelf: "center" }}
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
                    width: 40,
                    height: 40,
                  }}
                  src={ezpiclogo}
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
