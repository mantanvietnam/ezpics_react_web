import React from "react";
import { Block } from "baseui/block";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/Scrollable";
import { Button, SIZE } from "baseui/button";
import DropZone from "@/components/Dropzone";
import { useEditor } from "@layerhub-io/react";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import axios from "axios";
import "@/components/Loading/Initial.css";
import { NavLink } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./imageInput.css";
import { FontItem } from "@/interfaces/common";
import { loadFonts } from "@/utils/media/fonts";
import { IStaticText } from "@layerhub-io/types";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import { generateToServer } from "@/api/gererateToServer";
import "@/components/Preview/newloading.css";
import ezlogo from "./EZPICS (converted)-03.png";

interface Tab {
  id: number;
  name: string;
  content: string;
}
export default function Uploads() {
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
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const idProduct = useAppSelector((state) => state.token.id);
  const token = useAppSelector((state) => state.token.token);
  const [loading, setLoading] = React.useState(false);
  const [nameTextVariable, setNameTextVariable] = React.useState("");
  const [nameTextLabel, setNameTextLabel] = React.useState("");
  const [nameImageVariable, setNameImageVariable] = React.useState("");
  const [nameImageLabel, setNameImageLabel] = React.useState("");
  const [contentTextVariable, setContentTextVariable] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState("");
  const addObjectImage = React.useCallback(
    (res: any, string1: any, string2: any) => {
      console.log("chạy hàm image added");
      if (editor) {
        const options = {
          id: res.data.data.id,
          type: "StaticImage",
          src: res.data?.data?.content?.banner,
          // width: 206,
          // height: 206,
          metadata: {
            naturalWidth: res.data.data.content.naturalWidth,
            naturalHeight: res.data.data.content.naturalHeight,
            initialHeight: res.data.data.content.initialHeight,
            initialWidth: res.data.data.content.initialWidth,

            lock: false,
            variable: string1,
            variableLabel: string2,
            page: Number(res.data.data.content.page),
          },
        };
        editor.objects.add(options);
        console.log(options);
      }
    },
    [editor]
  );
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
      setLoading(true);
      console.log(nameImageVariable, nameImageLabel);
      const res = await axios.post(
        `${network}/addLayerImageUrlAPI`,
        {
          idproduct: idProduct,
          token: token,
          imageUrl:
            "https://apis.ezpics.vn/plugins/ezpics_api/view/image/default-thumbnail-vuong.jpg",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);

      if (res.data.code === 1) {
        addObjectImage(res, nameImageVariable, nameImageLabel);
        setLoading(false);
      }
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
    } else {
      setLoading(true);
      if (editor) {
        const font: FontItem = {
          name: "Helve",
          url: "https://apis.ezpics.vn/upload/admin/fonts/UTMHelve.woff",
        };
        await loadFonts([font]);
        const res = await axios.post(`${network}/addLayerText`, {
          idproduct: idProduct,
          token: token,
          text: contentTextVariable,
          color: "#333333",
          size: 92,
          font: font.name,
        });
        if (res.data.code === 1) {
          console.log(res.data);
          const options = {
            id: res.data.data.id,
            type: "StaticText",
            width: 420,
            text: contentTextVariable,
            fontSize: 92,
            fontFamily: font.name,
            textAlign: "center",
            fontStyle: "normal",
            fontURL: font.url,
            fill: "#000000",
            metadata: {
              variable: nameTextVariable,
              variableLabel: nameTextLabel,
              lock: false,
              uppercase: contentTextVariable,
            },
          };
          console.log(nameTextVariable, nameTextLabel);
          editor.objects.add<IStaticText>(options);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error("Có lỗi khi tạo mới biến chữ", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
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
  function toLowerCaseNonAccentVietnamese(str: any) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    // return str;
    str = str.replace(/\s+/g, "_");
    console.log(str);
    const randomNumber = (Math.floor(Math.random() * 99) + 1).toString();

    return `${str}${randomNumber}`;
  }
  function toLowerCaseNonAccentVietnameseNew(str: any) {
    console.log(str);
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    str = str.replace(/\s+/g, "_");
    const randomNumber = (Math.floor(Math.random() * 99) + 1).toString();

    setContentTextVariable(`%${str}${randomNumber}%`);
    setNameTextVariable(`${str}${randomNumber}`);
    console.log(contentTextVariable, nameTextVariable);
  }
  return (
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
        <Block style={{}}>
          <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            Mẫu in hàng loạt
          </h4>
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
            <Tabs forceRenderTabPanel defaultIndex={1}>
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
                    onBlur={(e) =>
                      toLowerCaseNonAccentVietnameseNew(e.target.value)
                    }
                    placeholder="Tên trường dữ liệu biến chữ"
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
                  Tạo biến chữ
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
                    onBlur={(e) =>
                      setNameImageVariable(
                        toLowerCaseNonAccentVietnamese(e.target.value)
                      )
                    }
                    placeholder="Tên trường dữ liệu biến ảnh"
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
                  Tạo biến ảnh
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
  );
}
