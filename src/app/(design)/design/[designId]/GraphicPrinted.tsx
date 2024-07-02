import Navbar from "../[designId]/components/Navbar";
import Panels from "./components/Panels";
import Canvas from "../[designId]/components/Canvas";
import Footer from "./components/Footer";
import Toolbox from "./components/Toolbox";
import EditorContainer from "../[designId]/components/EditorContainer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { useEditor } from "@layerhub-io/react";
import { IDesign } from "@/interfaces/DesignEditor";
import { IScene } from "@layerhub-io/types";
import { loadVideoEditorAssets } from "@/utils/media/video";
import { v4 as uuidv4 } from "uuid";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { REPLACE_TOKEN, REPLACE_ID_USER } from "@/redux/slices/token/reducers";
import "@/app/(main)/design/components/Resizable/loading.css";
import "@/app/(main)/design/components/Preview/newestLoading.css";
import useAppContext from "@/hooks/useAppContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function GraphicPrinted() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { setActiveSubMenu } = useAppContext();
  const editor = useEditor();
  const [errorMessage, setError] = React.useState<boolean>(false);

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
  const { setScenes, setCurrentDesign, setDisplayPreview } =
    useDesignEditorContext();

  const [imageData, setImageData] = React.useState("");
  const downloadImage = async (fileName: any) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = fileName;
    link.click();
    setLoading(false);
  };

  const imageRender = React.useCallback(async () => {
    if (editor) {
      const template = editor.scene.exportToJSON();

      try {
        const image = await new Promise((resolve, reject) => {
          const rendered = editor.renderer.render(template);
          if (typeof rendered === "string") {
            resolve(rendered);
          } else {
            reject("Error rendering image");
          }
        });

        console.log("Rendered image:", image);
        setImageData(image as string);
        setLoading(false);
      } catch (error) {
        console.error("Error rendering image:", error);
        setLoading(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    setLoading(true);
    const fetchDataBanks = async () => {
      try {
        const data = {
          idproduct: parseInt(id),
          token: checkTokenCookie(),
        };

        const response = await axios.post(`${networkAPI}/listLayerAPI`, data);

        if (response && response.data.code === 1) {
          const promises = Object.entries(stateData).map(
            async ([key, value]: [string, unknown]) => {
              response.data?.data.productDetail.forEach(
                (item: any, index: any) => {
                  if (typeof value === "string") {
                    if (value.includes("http")) {
                      if (item.content.variableLabel === key) {
                        item.content.banner = value;
                        console.log(item.content.banner);
                      }
                      console.log(value);
                    } else {
                      if (item.content.variableLabel === key) {
                        item.content.text = value;
                        console.log(item.content.text);
                        console.log(value);
                      }
                      console.log(value);
                    }
                    console.log(item);
                  }
                }
              );
            }
          );
          await Promise.all(promises);

          const dataRender = dataFunction(
            [...response.data?.data.productDetail],
            response.data?.data?.width,
            response.data?.data?.height,

            response.data?.data?.thumn,
            response.data?.data?.id
          );
          console.log(dataRender);
          if (dataRender) {
            const dataSceneImport = dataScenes(dataRender);
            console.log(dataSceneImport);
            // await loadTemplate(dataRender);
            if (dataSceneImport) {
              console.log(dataSceneImport);
              await handleImportTemplate(dataSceneImport);
              await imageRender();

              if (imageData === null) {
                await fetchDataBanks();
              }
            }
          }
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchDataBanks();
  }, [imageData, editor]);

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
      console.log(preview);
      scenes.push({ ...loadedScene, preview });
    }

    return { scenes, design };
  };
  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      let template;
      // const { scenes: scns, ...design } = data;
      template = await loadGraphicTemplate(data);
      // //   @ts-ignore
      console.log(template);
      setScenes(template.scenes);
      // //   @ts-ignore
      setCurrentDesign(template.design);
    },
    [editor]
  );

  const dataFunction = (
    data: any,
    width: any,
    height: any,
    srcBackground: any,
    idBackground: any
  ) => {
    const dataString = {
      frame: { initialWidth: width, initialHeight: height },
      content: [] as any,
    };

    if (data) {
      data.forEach(async (detail: any, index: number) => {
        if (detail.content.type == "text") {
          let stringMerged;
          stringMerged = detail.content.text.replace(/<br\s*\/>/g, "\n");
          dataString.content.push({
            id: detail.id,
            name: "StaticText",
            angle: 0,
            stroke: null,
            strokeWidth: 0,
            left: (detail.content.postion_left / 100) * width,
            top: (detail.content.postion_top / 100) * height,
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
                ? detail.content.gradient_color[0]?.color
                : detail.content.color,
            width:
              (parseInt(detail.content.width.replace(/vw/g, "")) * width) / 100,
            // height: null,
            // fontFamily: detail.content.font,
            fontFamily: detail.content.font,
            fontSize:
              (parseInt(detail.content.size.replace(/vw/g, "")) * width) / 100,
            // (parseInt(detail.content.width, 10) / parseInt(width)) * 10000
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
              srcBackground: srcBackground,
              idBackground: idBackground,
            },
          });
        } else if (detail.content.type == "image") {
          dataString.content.push({
            id: detail.id,
            name: "StaticImage",
            angle: 0,
            stroke: null,
            strokeWidth: 0,
            left: (detail.content.postion_left / 100) * width,
            top: (detail.content.postion_top / 100) * height,
            opacity: detail.content.opacity,
            originX: "left",
            originY: "top",
            scaleX:
              (parseInt(detail.content.width.replace(/vw/g, "")) * width) /
              100 /
              detail.content.naturalWidth,
            // img.naturalWidth,
            scaleY:
              (parseInt(detail.content.width.replace(/vw/g, "")) * width) /
              100 /
              detail.content.naturalWidth,
            // img.naturalWidth,
            // parseInt(width),
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
              srcBackground: srcBackground,
              idBackground: idBackground,
            },
          });
        }
      });
    }

    return dataString;
  };

  const { id, token, stateData } = location.state;

  if (token && id) {
    dispatch(REPLACE_TOKEN(token));
    dispatch(REPLACE_ID_USER(id));
  }

  const dataScenes = (data: any) => {
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

    if (data) {
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

          // Sử dụng cú pháp [newElement, ...array] để thêm một phần tử vào đầu mảng matchingDetails
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
              // height: parseInt(height),
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

      if (shouldRemove) {
        data.layers.splice(1, 1);
      }
    });

    return dataString;
  };

  const networkAPI = useAppSelector((state) => state.network.ipv4Address);

  useEffect(() => {
    setActiveSubMenu("FontSelector");
  }, []);

  // useEffect(() => {
  //   const fetchDataBanks = async () => {
  //     setLoading(true);
  //     try {
  //       dispatch(REPLACE_TYPE_USER(dataRes?.type));

  //       if (dataRes) {
  //         const dataRender = dataFunction(dataRes);
  //         if (dataRender) {
  //           const dataSceneImport = dataScenes(dataRender);
  //           // await loadTemplate(dataRender);
  //           if (dataSceneImport) {
  //             console.log(dataSceneImport);
  //             await handleImportTemplate(dataSceneImport);
  //           }
  //           setTimeout(() => {
  //             setLoading(false);

  //             console.log(dataRes);
  //           }, 4000);
  //         }
  //       }

  //       // //   @ts-ignore
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDataBanks();
  // }, [dataRes]);
  const handleDownloadImage = async (e: any) => {
    e.preventDefault();

    downloadImage("preview.png");
  };

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

        {
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              position: "absolute",
              zIndex: 200,
              paddingTop: "6%",
              paddingRight: "2%",
              paddingLeft: "18%",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "2%",
              }}
            >
              <button
                onClick={(e) => handleDownloadImage(e)}
                style={{
                  marginLeft: "20px",
                  height: 50,
                  alignSelf: "center",
                  textTransform: "none",
                  color: "white",
                  backgroundColor: "rgb(255, 66, 78)",
                  position: "relative",
                  border: 0,
                  paddingLeft: 30,
                  paddingRight: 30,
                  fontSize: 17,
                  fontWeight: "500",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Tải ảnh
              </button>
              <button
                onClick={() => navigate(-1)}
                style={{
                  marginLeft: "20px",
                  height: 50,
                  alignSelf: "center",
                  textTransform: "none",
                  color: "white",
                  backgroundColor: "rgb(255, 66, 78)",
                  position: "relative",
                  border: 0,
                  paddingLeft: 30,
                  paddingRight: 30,
                  fontSize: 17,
                  fontWeight: "500",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Nhập lại thông tin
              </button>
            </div>
            <div
              style={{
                width: "100%",
                height: "80%",
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              {imageData ? (
                <img
                  style={{
                    alignSelf: "center",
                    width: "auto",
                    height: "80%",
                  }}
                  src={imageData}
                />
              ) : (
                <Skeleton height={400} width={400} style={{ marginTop: 50 }} />
              )}
            </div>
            {/* {(
              loading && <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
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
            )} */}
          </div>
        }
      </EditorContainer>
    </>
  );
}

export default GraphicPrinted;
