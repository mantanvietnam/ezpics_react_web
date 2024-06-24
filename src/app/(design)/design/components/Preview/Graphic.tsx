import React from "react";
import { Block } from "baseui/block";
import { useEditor } from "@layerhub-io/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import { generateToServer } from "@/api/gererateToServer";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
export default function () {
  const editor = useEditor();
  const [loading, setLoading] = React.useState(true);
  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const [state, setState] = React.useState({
    image: "",
  });
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
    function findIndexById(arr: any, targetId: any) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === targetId) {
          return i;
        }
      }
      return -1; // Trả về -1 nếu không tìm thấy
    }
    let resultIndex = findIndexById(graphicTemplate.scenes, currentScene.id);

    const allLayers = graphicTemplate.scenes.map((scene: any) => scene.layers);

    const newDesign = generateToServer({
      frame: currentDesign.frame,
      data: allLayers,
    });
    console.log(newDesign);
    return newDesign;
  };
  async function base64ToFile(base64String: any, fileName: any) {
    try {
      // Remove the "data:image/png;base64," prefix from the base64 string
      const base64WithoutPrefix = base64String.replace(
        /^data:[a-z]+\/[a-z]+;base64,/,
        ""
      );

      // Convert the base64 string to a Blob
      const blob = await fetch(
        `data:image/png;base64,${base64WithoutPrefix}`
      ).then((response) => response.blob());

      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  }
  const base64ToBlob = (base64: any) => {
    const base64Data = base64.split(",")[1];

    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(base64Data.length);
    for (let i = 0; i < base64Data.length; i++) {
      bytes[i] = base64Data.charCodeAt(i);
    }
    return new Blob([bytes], { type: "image/png" }); // replace 'image/png' with your image type
  };
  const handleConversion = async (base64String: any, filePath: any) => {
    // Remove the "data:image/png;base64," prefix
    const base64Data = base64String.split(",")[1];
    console.log(base64Data, base64String);

    // Convert base64 to a Blob
    const blob = new File([base64Data], filePath, { type: "image/png" });

    // Create a FormData object
    const formData = new FormData();

    formData.append("file", blob);
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

      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const network = useAppSelector((state) => state.network.ipv4Address);
  const downloadImage = async (imageData: any, fileName: any) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = fileName;
    link.click();

    // Now that the file is downloaded, you can use it in the Axios POST request
  };
  async function urlToImageFile(base64String: any, fileName: any) {
    try {
      const base64WithoutPrefix = base64String.replace(
        /^data:[a-z]+\/[a-z]+;base64,/,
        ""
      );

      // Convert the base64 string to a Blob
      const blob = await fetch(
        `data:image/png;base64,${base64WithoutPrefix}`
      ).then((response) => response.blob());

      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  }
  function dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const idProduct = useAppSelector((state) => state.token.id);
  const token = useAppSelector((state) => state.token.token);
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

  const makePreview = React.useCallback(async () => {
    if (editor) {
      const template = editor.scene.exportToJSON();
      const image = (await editor.renderer.render(template)) as string;
      setLoading(false);
      if (image) {
        // const res = await axios.post(`${network}/addListLayerAPI`, {
        //   idProduct: idProduct,
        //   token: token,
        //   listLayer: JSON.stringify(parseGraphicJSON()),
        // });
        // if (res.data.code === 1) {
        //   setState({ image });
        //   // const imageFile = await fetch(image).then((res) => res.blob());
        //   // await handleConversion(image, "preview.png")
        //   const base64Data = image.split(",")[1];
        //   console.log(base64Data, image);

        //   // Convert base64 to a Blob
        //   const blob = new File([base64Data], image, { type: "image/png" });

        //   // Create a FormData object
        //   const formData = new FormData();

        //   formData.append("file", base64toFile(image,'preview.png'));
        //   formData.append("idProduct", idProduct);
        //   formData.append("token", token);

        //   try {
        //     // Make an Axios POST request with the FormData
        //     const response = await axios.post(
        //       `${network}/saveImageProductAPI`,
        //       formData,
        //       {
        //         headers: {
        //           "Content-Type": "multipart/form-data",
        //         },
        //       }
        //     );

        //     console.log("File uploaded successfully:", response.data);
        //     if (response.data.code === 1) {
        //       downloadImage(image, "preview.png");
        //     }

        //   } catch (error) {
        //     console.error("Error uploading file:", error);
        //   }
        //   toast("Xuất ảnh thành công !! 🦄", {
        //     position: "top-left",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //   });
        // } else {
        //   toast("Xuất ảnh thất bại !! 🦄", {
        //     position: "top-left",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //   });
        // }
        downloadImage(image, "preview.png");

        setState({ image });
        toast("Xuất ảnh thành công !! 🦄", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  }, [editor]);
  const makePreviewNotDown = React.useCallback(async () => {
    if (editor) {
      const template = editor.scene.exportToJSON();
      const image = (await editor.renderer.render(template)) as string;
      setState({ image });
      setLoading(false);
      if (image) {
        downloadImage(image, "preview.png");
      }
      toast("Tải thành công !! 🦄", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [editor]);

  React.useEffect(() => {
    makePreview();
  }, [editor]);

  return (
    <Block
      $style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: "5rem",
      }}
    >
      {!loading && <img width={"auto"} height={"100%"} src={state.image} />}
    </Block>
  );
}
