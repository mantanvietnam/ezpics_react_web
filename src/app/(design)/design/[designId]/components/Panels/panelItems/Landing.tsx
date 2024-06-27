"use client";
import React, { useEffect } from "react";
import { Block } from "baseui/block";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/Scrollable";
import { Button, SIZE } from "baseui/button";
import DropZone from "@/components/Dropzone";
import { useEditor } from "@layerhub-io/react";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import axios from "axios";
import "@/components/Loading/Initial.css";
import ezlogo from "./EZPICS (converted)-03.png";

import { NavLink } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./imageInput.css";
import "@/components/Preview/newloading.css";
import useAppContext from "@/hooks/useAppContext";
import ArrowBackOutline from "@/components/Icons/ArrowBackOutline";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { generateToServer } from "@/api/gererateToServer";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
interface Tab {
  id: number;
  name: string;
  content: string;
}
export default function Landing() {
  console.log("come here");
  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = React.useState<any[]>([]);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const editor = useEditor();
  const { setActiveSubMenu } = useAppContext();
  const variable = useAppSelector((state) => state.variable.metadataVariables);

  const setIsSidebarOpen = useSetIsSidebarOpen();
  const idProduct = useAppSelector((state) => state.token.id);
  const token = useAppSelector((state) => state.token.token);
  const [loading, setLoading] = React.useState(false);
  const [nameImageVariable, setNameImageVariable] = React.useState("");
  const [nameImageLabel, setNameImageLabel] = React.useState("");
  const [nameTextVariable, setNameTextVariable] = React.useState("");
  const [nameTextLabel, setNameTextLabel] = React.useState("");
  const [contentTextVariable, setContentTextVariable] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState("");
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
    // console.log(resultIndex);
    // console.log(graphicTemplate.scenes)
    // console.log(currentScene.id)
    // makeDownload(graphicTemplate);
    const allLayers = graphicTemplate.scenes.map((scene: any) => scene.layers);
    console.log(graphicTemplate);
    console.log(currentDesign.frame, allLayers);
    const newDesign = generateToServer({
      frame: currentDesign.frame,
      data: allLayers,
    });
    console.log(newDesign);
    return newDesign;
    // let newArr : any=[];
    // console.log(newArr)
  };
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

    // downloadImage(image, "preview.png");
    console.log(JSON.stringify(parseGraphicJSON()));
    setLoading(true);

    try {
      const res = await axios.post(`${network}/addListLayerAPI`, {
        idProduct: idProduct,
        token: token,
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
  const addObjectImage = React.useCallback(
    (res: any) => {
      if (editor) {
        const options = {
          id: res.data.id,
          name: "StaticImage",
          src: "https://apis.ezpics.vn/plugins/ezpics_api/view/image/default-thumbnail-vuong.jpg",
          width: 206,
          height: 206,
          metadata: {
            naturalWidth: 206,
            naturalHeight: 206,
            initialHeight: 206,
            initialWidth: 206,

            lock: false,
            variable: nameImageVariable,
            variableLabel: nameImageLabel,
          },
        };
        // editor.objects.add(options);
      }
    },
    [editor]
  );
  useEffect(() => {
    console.log(editor);
    if (variable) {
      console.log(variable);
      if (variable?.uppercase === undefined) {
        setNameImageVariable(variable?.variable);
        setNameImageLabel(variable?.variableLabel);
        console.log(variable?.variable);
      } else {
        setNameTextVariable(variable?.variable);
        setNameTextLabel(variable?.variableLabel);
        setContentTextVariable(`%${variable?.variable}%`);
        // setSelectedOption()
        if (variable?.uppercase === "lower") {
          setSelectedOption("2");
        } else if (variable?.uppercase === "upper") {
          setSelectedOption("1");
        } else if (variable?.uppercase === "") {
          setSelectedOption("0");
        }
      }
    }
  }, []);

  const options = [
    { value: "", label: "Chọn trạng thái" },
    { value: "0", label: "Mặc định" },
    { value: "1", label: "Viết hoa hết" },
    { value: "2", label: "Viết thường hết" },
  ];
  // const []
  const addObject = async () => {
    if (nameImageVariable === "" || nameImageLabel === "") {
      toast.error("Các trường bị thiếu, hãy thử lại", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      editor.objects.update({
        metadata: {
          variable: nameImageVariable,
          variableLabel: nameImageLabel,
        },
      });
      await makePreview();
    }
  };

  const addObjectText = async () => {
    if (
      selectedOption === "" ||
      nameTextLabel === "" ||
      contentTextVariable === "" ||
      nameTextVariable === ""
    ) {
      toast.error("Các trường bị thiếu, hãy thử lại", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(
        selectedOption,
        nameTextLabel,
        contentTextVariable,
        nameTextVariable
      );
    } else {
      if (editor) {
        // const font: FontItem = {
        //   name: "Helve",
        //   url: "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff",
        // };
        // await loadFonts([font]);
        // const res = await axios.post(`${network}/addLayerText`, {
        //   idproduct: idProduct,
        //   token: token,
        //   text: contentTextVariable,
        //   color: "#333333",
        //   size: 92,
        //   font: font.name,
        // });
        // if (res.data.code === 1) {
        //   console.log(res.data);
        //   const options = {
        //     id: res.data.data.id,
        //     type: "StaticText",
        //     width: 420,
        //     text: contentTextVariable,
        //     fontSize: 92,
        //     fontFamily: font.name,
        //     textAlign: "center",
        //     fontStyle: "normal",
        //     fontURL: font.url,
        //     fill: "#000000",
        //     metadata: {
        //       variable: nameTextVariable,
        //       variableLabel: nameTextLabel,
        //     },
        //   };
        //   editor.objects.add<IStaticText>(options);
        //   setLoading(false);
        // } else {
        //   setLoading(false);
        //   toast.error("Có lỗi khi tạo mới biến chữ", {
        //     position: "top-left",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //   });
        // }
        // editor.objects.update({  });
        editor.objects.update({
          text: contentTextVariable,
          metadata: {
            lock: false,
            variable: nameTextVariable,
            variableLabel: nameTextLabel,
            uppercase: contentTextVariable,
          },
        });
        await makePreview();
      }
    }
  };
  const handleDropFiles = async (files: FileList) => {
    setLoading(true);
    const file = files[0];
    const url = URL.createObjectURL(file);
    // let blob = await fetch(url).then(r => r.blob());
    // Kiểm tra đuôi file
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      // setLoading(false);

      return;
    }

    const res = await axios.post(
      `${network}/addLayerImageAPI`,
      {
        idproduct: idProduct,
        token: token,
        file: file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    console.log(files);

    if (res.data.code === 1) {
      const upload = {
        id: res.data.data.id,
        url: res.data.data.content.banner,
      };
      setUploads([...uploads, upload]);
      const options = {
        type: "StaticImage",
        src: res.data.data.content.banner,
        id: res.data.data.id,
      };
      editor.objects.add(options);
      setLoading(false);
    }
  };

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };
  const generateTabs = (): Tab[] => [
    { id: 1, name: "Tab 1", content: "This is content for Tab 1" },
    { id: 2, name: "Tab 2", content: "This is content for Tab 2" },
    { id: 3, name: "Tab 3", content: "This is content for Tab 3" },
  ];
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!);
  };

  const addImageToCanvas = (url: string) => {
    const options = {
      type: "StaticImage",
      src: url,
    };
    editor.objects.add(options);
  };
  return (
    <DropZone handleDropFiles={handleDropFiles}>
      <Block
        $style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
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
          <Block
            $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            onClick={() => setActiveSubMenu("Layers")}
          >
            <ArrowBackOutline size={24} />
            <Block>
              <h3 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                Sửa biến
              </h3>
            </Block>
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
            <div style={{}}>
              <Tabs
                forceRenderTabPanel
                defaultIndex={variable?.uppercase === undefined ? 1 : 0}
              >
                <TabList
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Tab
                    style={{
                      flex: 1,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disabled={variable?.uppercase === undefined}
                  >
                    <h4 style={{ fontFamily: "Arial", textAlign: "center" }}>
                      Biến chữ
                    </h4>
                  </Tab>
                  <Tab
                    style={{
                      flex: 1,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disabled={variable?.uppercase !== undefined}
                  >
                    <h4 style={{ fontFamily: "Arial", textAlign: "center" }}>
                      Biến ảnh
                    </h4>
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="input-group">
                    <h4 style={{ fontFamily: "Arial" }}>Biến chữ</h4>
                    <p style={{ fontFamily: "Arial" }}>
                      Tên trường dữ liệu biến chữ
                    </p>

                    <input
                      type="text"
                      onChange={(e) => setNameTextLabel(e.target.value)}
                      placeholder="Tên trường dữ liệu biến chữ"
                      value={nameTextLabel}
                    />
                  </div>
                  <div className="input-group">
                    <p style={{ fontFamily: "Arial" }}>Tên biến chữ</p>

                    <input
                      disabled
                      type="text"
                      onChange={(e) => setNameTextVariable(e.target.value)}
                      onBlur={(e) =>
                        e.target.value === ""
                          ? setContentTextVariable(``)
                          : setContentTextVariable(`%${e.target.value}%`)
                      }
                      placeholder="Tên biến chữ"
                      value={nameTextVariable}
                    />
                  </div>
                  <div className="input-group">
                    <p style={{ fontFamily: "Arial" }}>Nội dung chữ</p>

                    <input
                      disabled
                      type="text"
                      value={contentTextVariable}
                      onChange={(e) => setContentTextVariable(e.target.value)}
                      placeholder="Nội dung chữ"
                    />
                  </div>
                  <div className="input-group">
                    <p style={{ fontFamily: "Arial" }}>Kiểu định dạng chữ</p>

                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      style={{ width: "100%", height: "auto" }}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={() => addObjectText()}
                    size={SIZE.compact}
                    overrides={{
                      Root: {
                        style: {
                          width: "100%",
                          marginBottom: "30px",
                        },
                      },
                    }}
                  >
                    Sửa biến chữ
                  </Button>
                </TabPanel>
                <TabPanel>
                  <div className="input-group">
                    <h4 style={{ fontFamily: "Arial" }}>Biến ảnh</h4>
                    <p style={{ fontFamily: "Arial" }}>
                      Tên trường dữ liệu biến ảnh
                    </p>

                    <input
                      type="text"
                      // value={name}
                      onChange={(e) => setNameImageLabel(e.target.value)}
                      placeholder="Tên trường dữ liệu biến ảnh"
                      value={nameImageLabel}
                    />
                  </div>
                  <div className="input-group">
                    <p style={{ fontFamily: "Arial" }}>Tên biến ảnh</p>

                    <input
                      type="text"
                      // value={description}
                      onChange={(e) => setNameImageVariable(e.target.value)}
                      placeholder="Tên biến ảnh"
                      value={nameImageVariable}
                    />
                  </div>

                  <Button
                    onClick={() => addObject()}
                    size={SIZE.compact}
                    overrides={{
                      Root: {
                        style: {
                          width: "100%",
                          marginBottom: "30px",
                        },
                      },
                    }}
                  >
                    Sửa biến ảnh
                  </Button>
                </TabPanel>
              </Tabs>
            </div>
          </Block>
        </Scrollable>
        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.7)",
              position: "absolute",
              zIndex: 20000000000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
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
                src={ezlogo}
              />
            </div>
          </div>
        )}
      </Block>
    </DropZone>
  );
}
