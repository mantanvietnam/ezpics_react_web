"use client";
import React, { useEffect } from "react";
import { Block } from "baseui/block";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useEditor } from "@layerhub-io/react";
import { useAppSelector } from "@/hooks/hook";
import { generateToServerSaving } from "@/api/gererateToServer";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import "./loading.css";
import { generateToServer } from "@/api/gererateToServer";
import { useActiveObject } from "@layerhub-io/react";
import { useDebouncedCallback } from "use-debounce";
import { checkTokenCookie } from "@/utils";

// window.addEventListener("online", () => getValueOnline());
// window.addEventListener("offline", () => handleOffline());
export default function EditorContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const editor = useEditor();
  const network = useAppSelector((state) => state?.network?.ipv4Address);
  const idProduct = useAppSelector((state) => state?.token?.id);
  const token = useAppSelector((state) => state?.token?.token);

  const activeObject = useActiveObject();

  const [loading, setLoading] = React.useState(false);

  const {
    setCurrentScene,
    currentScene,
    scenes,
    currentDesign,
    setCurrentDesign,
  } = useDesignEditorContext();
  function getCookie(cname: any) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const handleSave = async () => {
    if (editor) {
      const retrievedData = localStorage.getItem("data-ezpics");
      const dataParsed = retrievedData ? JSON.parse(retrievedData) : null;
      setLoading(true);

      try {
        const res = await axios.post(`${network}/addListLayerAPI`, {
          idProduct: idProduct,
          token: checkTokenCookie(),
          listLayer: JSON.stringify(parseGraphicJSON(dataParsed)),
        });

        if (res.data.code === 1) {
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
        setLoading(false);
      }
    }
  };
  const loadTemplate = React.useCallback(
    async () => {
      if (editor) {
        const initial = editor.scene.exportToJSON();
        const template = initial;

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
        // const filteredFonts = fonts.filter((f) => !!f.url);
        // if (filteredFonts.length > 0) {
        //   await loadFonts(filteredFonts);
        // }
        // setCurrentScene
        // setCurrentScene({ ...template, id: currentScene?.id });
        // scenes.push({ ...template, id: currentScene?.id });
        setCurrentScene({ ...template, id: currentScene?.id ?? "" });
        // setCurrentDesign({...template, id: currentScene?.id });
      }
    },
    // editor,
    [scenes, currentScene, currentDesign]
  );

  const options = {
    title: "Đã có mạng trở lại",
    message: "Bạn có muốn lưu dữ liệu cũ không ?",
    buttons: [
      {
        label: "Không",
        onClick: async () => await loadTemplate(),
        style: {
          backgroundColor: "white",
          color: "black",
          width: "50%",
          border: "1px solid gray",
        },
      },
      {
        label: "Có",
        onClick: async () => await handleSave(),
        style: {
          width: "50%",
        },
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };
  const getValueOnline = async () => {
    let dataCookie = getCookie("data-ezpics");
    const retrievedData = localStorage.getItem("data-ezpics");

    if (retrievedData === null) {
      toast("Dữ liệu trống", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      const dataParsed = JSON.parse(retrievedData);
      confirmAlert(options);
      toast("Có mạng !! 🦄", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // const response = await axios.post()
    }
  };
  const parseGraphicJSON = (data: any) => {
    const newDesign = generateToServer({
      frame: currentDesign.frame,
      data: data,
    });
    return newDesign;
    // let newArr : any=[];
  };
  const handleOffline = () => {
    if (editor) {
      const template = editor.scene.exportToJSON();

      toast.error("Mất mạng, tự động lưu lịch sử chỉnh sửa vào bộ nhớ tạm", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      function findIndexById(arr: any, targetId: any) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === targetId) {
            return i;
          }
        }
        return -1; // Trả về -1 nếu không tìm thấy
      }
      let resultIndex = findIndexById(graphicTemplate.scenes, currentScene.id);

      // makeDownload(graphicTemplate);
      const allLayers = graphicTemplate.scenes.map(
        (scene: any) => scene.layers
      );
      const jsonString = JSON.stringify(allLayers);
      // const jsonString = "okkk";

      localStorage.setItem("data-ezpics", jsonString);

      document.cookie = `data-ezpics=${jsonString}`;
    }
  };
  const handleKeyDown = (e: any) => {
    if (activeObject) {
      if (e.key === "ArrowLeft") {
        console.log("ArrowLeft");
      } else if (e.key === "ArrowRight") {
        console.log("ArrowRight");
      }
    }
  };
  // const handleKeyUp = (e: any) => {
  //   if (activeObject) {
  //     if (e.key === "ArrowLeft") {
  //       console.log("ArrowLeft");
  //     } else if (e.key === "ArrowRight") {
  //       console.log("ArrowRight");
  //     }
  //   }
  // };
  const [distance, setDistance] = React.useState({
    left: 0,
    top: 0,
  });

  const alertUser = (e: any) => {
    e.preventDefault();
    // return e.returnValue = "Are you sure you want to leave the page?";
    return "Data will be lost if you leave the page, are you sure?";
  };
  useEffect(() => {
    window.addEventListener("online", getValueOnline);
    window.addEventListener("offline", handleOffline);

    // window.addEventListener("beforeunload", handleOffline);

    return () => {
      window.removeEventListener("online", getValueOnline);
    };
  }, [editor]);
  function throttle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastTime = 0;
    return function (...args: Parameters<T>) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTime >= delay) {
        callback(...args);
        lastTime = currentTime;
      }
    };
  }
  window.addEventListener(
    "keydown",
    useDebouncedCallback(
      (event: any) => {
        if (activeObject) {
          if (event.key === "ArrowDown") {
            editor.objects.update({ top: distance.top + 5 });
            setDistance({ ...distance, top: distance.top + 5 });
          } else if (event.key === "ArrowUp") {
            editor.objects.update({ top: distance.top - 5 });
            setDistance({ ...distance, top: distance.top - 5 });
          } else if (event.key === "ArrowLeft") {
            editor.objects.update({ left: distance.left - 5 });

            setDistance({ ...distance, left: distance.left - 5 });
          } else if (event.key === "ArrowRight") {
            editor.objects.update({ left: distance.left + 5 });
            setDistance({ ...distance, left: distance.left + 5 });
          }
        }
      },
      700,
      { maxWait: 2000 }
    )
  );

  return (
    <Block
      $style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
      }}>
      {children}
    </Block>
  );
}
