import React from "react";
import { useRouter } from "next/navigation";
import { styled, ThemeProvider, DarkTheme, LightTheme } from "baseui";
import { Theme } from "baseui/theme";
import { Button, KIND } from "baseui/button";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { Block } from "baseui/block";
import { useEditor } from "@layerhub-io/react";
import { IScene } from "@layerhub-io/types";
import { loadTemplateFonts } from "@/utils/media/fonts";
import { loadVideoEditorAssets } from "@/utils/media/video";
import { IDesign } from "@/interfaces/DesignEditor";
import EzpicsLogo from "./avatar.png";
import { useAppSelector } from "@/hooks/hook";
import axios from "axios";
import { toast } from "react-toastify";
import imageIcon from "./save.png";
import exportIcon from "./Layer 2.png";
import "../../../../(design)/design/components/Preview/newloading.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import warning from "./warning.png";
import ezlogo from "./EZPICS (converted)-03.png";
import Image from "next/image";

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  height: "64px",
  background: $theme.colors.black,
  display: "flex",
  padding: "0 1.25rem",
  gridTemplateColumns: "240px 1fr 240px",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}));

export default function Navbar() {
  const router = useRouter();
  const parseData = (data: any) => {
    console.log(data);
    let dataReal = [] as any[];

    data.colorStops.map((stop: any, index: number) => {
      const position = index === 0 ? 0 : 0.5;
      dataReal.push({
        position: position,
        color: stop.color,
      });
    });

    return dataReal;
  };

  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const editor = useEditor();
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const network = useAppSelector((state) => state?.network?.ipv4Address);
  const idProduct = useAppSelector((state) => state?.token?.id);
  const token = useAppSelector((state) => state?.token?.token);
  const [modalBuyingFree, setModalBuyingFree] = React.useState(false);
  const generateToServer = (datas: any) => {
    // Remove the first two elements from the first sub-array
    datas.data[0].splice(0, 2);

    console.log(datas);
    // Remove elements with id 'background' from each sub-array
    datas.data.forEach((data: any) => {
      const indexToRemove = data.findIndex(
        (element: any) => element.id === "background"
      );
      if (indexToRemove !== -1) {
        data.splice(indexToRemove, 1);
      }
    });

    // Flatten the modified array
    const flattenedArray = datas.data.flat();

    // Rest of your code...
    const initialData: any[] = [];

    flattenedArray.map((data: any, index: number) => {
      if (data.type === "StaticImage") {
        initialData.push({
          id: data?.id,
          content: {
            type: "image",
            text: "Layer 2",
            color: data?.fill,
            size: `${
              (data?.scaleX * 100 * data?.metadata?.naturalWidth) /
              datas?.frame?.width
            }vw`, //
            font: data?.fontFamily,
            status: 1,
            text_align: "left",
            postion_left: (data?.left * 100) / datas?.frame?.width, //
            postion_top: (data?.top * 100) / datas?.frame?.height, //
            brightness: 100, //
            contrast: 100, //
            saturate: 100, //
            opacity: data?.opacity, //
            gachchan: data?.underline,
            uppercase: "none",
            innghieng: "normal",
            indam: "normal",
            linear_position: "to right",
            border: 0,
            rotate: "0deg", //
            banner: data?.src, //
            gianchu: "normal",
            giandong: "normal",
            width: `${
              (data?.scaleX * 100 * data?.metadata?.naturalWidth) /
              datas?.frame?.width
            }vw`,
            height: "100vh", //
            gradient: 0,
            gradient_color: [],
            variable: data?.metadata?.variable,
            variableLabel: data?.metadata?.variableLabel,
            lock: 0,
            lat_anh: 0, //
            naturalWidth: data?.metadata?.naturalWidth,
            naturalHeight: data?.metadata?.naturalHeight,
            image_svg: "",
            page: Number(data?.metadata?.page),
          },
          sort: index + 1,
        });
      } else if (data.type === "StaticText") {
        // console.log(data, index);
        initialData.push({
          id: data?.id,
          content: {
            type: "text",
            text: data?.text, //
            color: typeof data?.fill === "string" ? data?.fill : "#000", //
            size:
              ((data?.fontSize * 100) / datas?.frame?.width).toString() + "vw", //
            font: data.fontFamily, //
            status: 1,
            text_align: data.textAlign, //
            postion_left: (data?.left * 100) / datas?.frame?.width, //
            postion_top: (data?.top * 100) / datas?.frame?.height, //
            brightness: 100, //
            contrast: 100, //
            saturate: 100, //
            opacity: data.opacity, //
            gachchan: data.underline, //
            uppercase: "none", //
            innghieng: "normal", //
            indam: "normal", //
            linear_position: "to right", //
            border: 0, //
            rotate: "0deg", //
            banner: "",
            gianchu: "normal",
            giandong: "normal",
            width: ((data.width * 100) / datas?.frame?.width).toString() + "vw",
            height: "0vh",
            gradient: typeof data?.fill === "string" ? 0 : 1,
            gradient_color:
              typeof data?.fill === "string" ? [] : parseData(data?.fill),
            variable: data?.metadata?.variable,
            variableLabel: data?.metadata?.variableLabel,
            lock: data?.metadata?.lock,
            lat_anh: 0,
            naturalWidth: data?.metadata?.naturalWidth,
            naturalHeight: data?.metadata?.naturalHeight,
            page: Number(data?.metadata?.page),
          },

          sort: index + 1,
        });
        console.log(data);
      }
    });

    return initialData;
  };
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

    const graphicTemplate: any = {
      id: currentDesign.id,
      type: "GRAPHIC",
      name: currentDesign.name,
      frame: currentDesign.frame,
      scenes: updatedScenes,
      metadata: {},
      preview: "",
    };
    console.log(updatedScenes);

    const allLayers = graphicTemplate.scenes.map((scene: any) => scene.layers);
    // console.log(graphicTemplate);
    console.log(currentDesign.frame, allLayers);
    const newDesign = generateToServer({
      frame: currentDesign.frame,
      data: allLayers,
    });
    newDesign.forEach(async (item: any, index: any) => {
      // Kiểm tra nếu id là chuỗi
      if (typeof item.id === "string") {
        console.log(item);
        if (item.content.type === "image") {
          const response = await axios.post(`${network}/addLayerImageUrlAPI`, {
            idproduct: idProduct,
            token: token,
            imageUrl: item.content.banner,
            page: 0,
          });
          if (response && response.data) {
            item.id = response.data?.data?.id;
            console.log(response.data);
          }
        } else if (item.content.type === "text") {
          const response = await axios.post(`${network}/addLayerText`, {
            idproduct: idProduct,
            token: token,
            text: "text",
            color: "#ffffff",
            size: "16px",
            font: "MTD Matsury",
            page: 0,
          });
          if (response && response.data) {
            item.id = response.data?.data?.id;
            console.log(response.data);
          }
        }
      }
    });
    // console.log()
    return newDesign;
  };
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
    paddingLeft: "30px",
    paddingRight: "30px",

    borderRadius: "15px",
  };
  // const parsePresentationJSON = () => {
  //   const currentScene = editor.scene.exportToJSON();
  //   console.log(currentScene);
  //   const updatedScenes = scenes.map((scn) => {
  //     if (scn.id === currentScene.id) {
  //       return {
  //         id: currentScene.id,
  //         duration: 5000,
  //         layers: currentScene.layers,
  //         name: currentScene.name,
  //       };
  //     }
  //     return {
  //       id: scn.id,
  //       duration: 5000,
  //       layers: scn.layers,
  //       name: scn.name,
  //     };
  //   });

  //   if (currentDesign) {
  //     const presentationTemplate: IDesign = {
  //       id: currentDesign.id,
  //       type: "PRESENTATION",
  //       name: currentDesign.name,
  //       frame: currentDesign.frame,
  //       scenes: updatedScenes,
  //       metadata: {},
  //       preview: "",
  //     };
  //     makeDownload(presentationTemplate);
  //   } else {
  //     console.log("NO CURRENT DESIGN");
  //   }
  // };
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
  const handleSaveIcon = async () => {
    const template = editor.scene.exportToJSON();
    const image = (await editor.renderer.render(template)) as string;

    // downloadImage(image, "preview.png");
    console.log(parseGraphicJSON());
    setLoading(true);

    try {
      const res = await axios.post(`${network}/addListLayerAPI`, {
        idProduct: idProduct,
        token: checkTokenCookie(),
        listLayer: JSON.stringify(parseGraphicJSON()),
      });
      if (res.data.code === 1) {
        const imageGenerate = await handleConversion(image, "preview.png");
        console.log(imageGenerate);
      } else {
        toast.error("Lưu mẫu thiết kế thất bại !! 🦄", {
          position: "top-left",
          autoClose: 2000,

          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
      }
      // console.log(res);
      // console.log(generateToServer(template));
    } catch (error) {
      toast.error("Lưu mẫu thiết kế thất bại !! 🦄", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
      setLoading(false);
    }
  };
  // const parseVideoJSON = () => {
  //   const currentScene = editor.scene.exportToJSON();
  //   const updatedScenes = scenes.map((scn) => {
  //     if (scn.id === currentScene.id) {
  //       return {
  //         id: scn.id,
  //         duration: scn.duration,
  //         layers: currentScene.layers,
  //         name: currentScene.name ? currentScene.name : "",
  //       };
  //     }
  //     return {
  //       id: scn.id,
  //       duration: scn.duration,
  //       layers: scn.layers,
  //       name: scn.name ? scn.name : "",
  //     };
  //   });
  //   if (currentDesign) {
  //     const videoTemplate: IDesign = {
  //       id: currentDesign.id,
  //       type: "VIDEO",
  //       name: currentDesign.name,
  //       frame: currentDesign.frame,
  //       scenes: updatedScenes,
  //       metadata: {},
  //       preview: "",
  //     };
  //     makeDownload(videoTemplate);
  //   } else {
  //     console.log("NO CURRENT DESIGN");
  //   }
  // };

  const makeDownload = (data: Object) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "template.json";
    a.click();
  };

  const makeDownloadTemplate = () => {
    return parseGraphicJSON();
  };

  const loadGraphicTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;
    console.log("payload" + payload);
    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
      };
      console.log("scns" + scene);

      const loadedScene = await loadVideoEditorAssets(scene);
      await loadTemplateFonts(loadedScene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      scenes.push({ ...loadedScene, preview });
    }

    return { scenes, design };
  };

  const loadPresentationTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn,
        layers: scn.layers,
        metadata: {},
      };
      const loadedScene = await loadVideoEditorAssets(scene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      await loadTemplateFonts(loadedScene);
      scenes.push({ ...loadedScene, preview });
    }
    return { scenes, design };
  };

  const loadVideoTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;

    for (const scn of scns) {
      const design: IScene = {
        name: "Awesome template",
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
        duration: scn.duration,
      };
      const loadedScene = await loadVideoEditorAssets(design);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      await loadTemplateFonts(loadedScene);
      scenes.push({ ...loadedScene, preview });
    }
    return { scenes, design };
  };

  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      let template;
      // if (data.type === "GRAPHIC") {
      // } else if (data.type === "PRESENTATION") {
      //   template = await loadPresentationTemplate(data);
      // } else if (data.type === "VIDEO") {
      //   template = await loadVideoTemplate(data);
      // }
      template = await loadGraphicTemplate(data);

      //   @ts-ignore
      setScenes(template.scenes);
      //   @ts-ignore
      setCurrentDesign(template.design);
    },
    [editor]
  );
  const [loadingBuyingFunc, setLoadingBuyingFunc] = React.useState(false);

  const downloadImage = (imageData: any, fileName: any) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = fileName;
    link.click();
  };
  const handleCloseModalFree = () => setModalBuyingFree(false);

  function base64toFile(base64Data: any, filename: any) {
    const arr = base64Data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const handleConversion = async (base64String: any, filePath: any) => {
    // Remove the "data:image/png;base64," prefix
    const base64Data = base64String.split(",")[1];
    const template = editor.scene.exportToJSON();
    const image = (await editor.renderer.render(template)) as string;

    // Convert base64 to a Blob
    const blob = new Blob([base64Data], { type: "image/png" });

    // Create a FormData object
    const formData = new FormData();

    formData.append("file", base64toFile(image, "preview.png"));
    formData.append("idProduct", idProduct);
    formData.append("token", token);

    try {
      // Make an Axios POST request with the FormData
      const response = await axios.post(
        `${network}/saveImageProductAPI`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.code === 1) {
        // console.log(res);
        // console.log(generateToServer(template));
        toast("Lưu mẫu thiết kế thành công !! 🦄", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/");
        setLoading(false);
      } else {
        toast.error("Lưu mẫu thiết kế thất bại !! 🦄", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
      }
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const makePreview = async () => {
    const template = editor.scene.exportToJSON();
    const image = (await editor.renderer.render(template)) as string;

    console.log(parseGraphicJSON());
    // setLoading(true);
    const dataRendering = parseGraphicJSON();
    await Promise.all(
      dataRendering.map(async (item: any, index: any) => {
        console.error(item);
        if (typeof item.id === "string") {
          if (item.content.type === "text") {
            try {
              const response = await axios.post(`${network}/addLayerText`, {
                idproduct: idProduct,
                token: checkTokenCookie(),
                page: item.content.page,
                text: item.content.text,
                color: "#ffffff",
                size: "16px",
                font: "MTD Matsury",
              });

              if (response && response.data) {
                item.id = response.data.id; // Update item.id here
                console.log(response.data);
              }
            } catch (error) {
              console.error("Error in axios.post:", error);
            }
          } else if (item.content.type === "image") {
            console.log(item);
            try {
              const response = await axios.post(
                `${network}/addLayerImageUrlAPI`,
                {
                  idproduct: idProduct,
                  token: checkTokenCookie(),
                  imageUrl: item.content.banner,
                  page: item.content.page,
                }
              );
              if (response && response.data) {
                item.id = response.data?.content?.id; // Update item.id here
                console.log(response.data);
              }
            } catch (error) {
              console.error("Error in axios.post:", error);
            }
          }
        }
      })
    );
    console.log(dataRendering);
    try {
      const res = await axios.post(`${network}/addListLayerAPI`, {
        idProduct: idProduct,
        token: checkTokenCookie(),
        listLayer: JSON.stringify(parseGraphicJSON()),
      });
      if (res.data.code === 1) {
        const imageGenerate = await handleConversion(image, "preview.png");
        console.log(imageGenerate);
      } else {
        toast.error("Lưu mẫu thiết kế thất bại !! 🦄", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
      }
      // console.log(res);
      // console.log(generateToServer(template));
    } catch (error) {
      toast.error("Lưu mẫu thiết kế thất bại !! 🦄", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
      setLoading(false);
    }
  };
  const handleNotSave = () => {
    router.push("/");
  };
  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };
  const handleReturnHome = () => {
    setModalBuyingFree(true);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (res) => {
        const result = res.target!.result as string;
        const design = JSON.parse(result);
        console.log(design);

        handleImportTemplate(design);
      };
      reader.onerror = (err) => {
        console.log(err);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <ThemeProvider theme={DarkTheme}>
        <Container>
          <div style={{ color: "#ffffff" }}>
            <Image
              alt=""
              src={EzpicsLogo}
              width={60}
              height={60}
              style={{ cursor: "pointer" }}
              onClick={() => handleReturnHome()}
            />
          </div>
          {/* <DesignTitle /> */}
          <Block
            $style={{
              alignSelf: "center",
              gap: "0.5rem",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <input
              multiple={false}
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
            />
            <Button
              size="compact"
              onClick={handleInputFileRefClick}
              kind={KIND.tertiary}
              overrides={{
                StartEnhancer: {
                  style: {
                    marginRight: "4px",
                  },
                },
              }}
            >
              Nhập dữ liệu JSON
            </Button>

            <Button
              size="compact"
              onClick={makeDownloadTemplate}
              kind={KIND.tertiary}
              overrides={{
                StartEnhancer: {
                  style: {
                    marginRight: "4px",
                  },
                },
              }}
            >
              Xuất dữ liệu JSON
            </Button>
            {/* <Button
            size="mini"
            onClick={}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                
              },
            }}
          >
            Xem ảnh
          </Button> */}
            <Button
              size="compact"
              onClick={makePreview}
              kind={KIND.tertiary}
              overrides={{
                StartEnhancer: {
                  style: {
                    marginRight: "4px",
                    paddingTop: "20px",
                    alignSelf: "center",
                    // marginBottom: "10px",
                  },
                },
              }}
            >
              <Image
                src={imageIcon}
                alt=""
                style={{ width: 15, height: 15, marginRight: 10 }}
              />
              Lưu mẫu thiết kế
            </Button>
            <Button
              size="compact"
              onClick={() => setDisplayPreview(true)}
              kind={KIND.tertiary}
              overrides={{
                StartEnhancer: {
                  style: {
                    marginRight: "4px",
                    paddingBottom: "10px",
                  },
                },
              }}
            >
              <Image
                alt=""
                src={exportIcon}
                style={{ width: 15, height: 15, marginRight: 10 }}
              />
              Xuất ảnh
            </Button>
          </Block>
        </Container>
      </ThemeProvider>
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
              src={ezlogo}
            />
          </div>
        </div>
      )}
      <Modal
        open={modalBuyingFree}
        onClose={handleCloseModalFree}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModalBuyingFree}>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: "bold",
              paddingBottom: "10px",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            Cảnh báo
          </p>
          <Image
            src={warning}
            alt=""
            style={{ width: "25%", height: "40%", marginBottom: "10px" }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: "500",
              paddingTop: "10px",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            Bạn muốn lưu mẫu thiết kế này trước khi rời đi chứ ?
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              paddingRight: "5%",
              paddingLeft: "5%",
            }}
          >
            <Button
              variant="contained"
              size="default"
              style={{
                height: 40,
                alignSelf: "center",
                textTransform: "none",
                color: "white",
                backgroundColor: "rgb(255, 66, 78)",
                marginTop: "40px",
                width: "50%",
                fontFamily: "Helvetica, Arial, sans-serif",
                marginRight: "5%",
              }}
              onClick={() => {
                handleSaveIcon();
              }}
            >
              {" "}
              {loadingBuyingFunc ? (
                <span class="loaderNew"></span>
              ) : (
                "Lưu mẫu thiết kế "
              )}
            </Button>
            <Button
              variant="contained"
              size="default"
              style={{
                height: 40,
                alignSelf: "center",
                textTransform: "none",
                color: "black",
                backgroundColor: "rgb(241, 242, 246)",
                marginTop: "40px",
                width: "50%",
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
              onClick={() => {
                handleNotSave();
              }}
            >
              {" "}
              {loadingBuyingFunc ? (
                <span className="loaderNew"></span>
              ) : (
                "Không lưu"
              )}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
