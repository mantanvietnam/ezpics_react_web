/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useEditor, useActiveObject } from "@layerhub-io/react";
import { Block } from "baseui/block";
import Scrollable from "@/components/Scrollable";
import AngleDoubleLeft from "@/components/Icons/AngleDoubleLeft";
import { useStyletron } from "baseui";
import useSetIsSidebarOpen from "@/hooks/useSetIsSidebarOpen";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import ezlogo from "./EZPICS (converted)-03.png";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { Button, SIZE } from "baseui/button";
import "@/components/Preview/newloading.css";
import ReactDOM from "react-dom";
import "./modal.css";
import check from "./check.png";
import remove from "./magic-wand (1).png";
import Image from "next/image";
import { checkTokenCookie } from "@/utils";

export default function Templates() {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();
  const network = useAppSelector((state) => state.network.ipv4Address);
  const token = checkTokenCookie();
  const idProduct = useAppSelector((state) => state?.token?.id);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
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
  const handleDropFiles = async (files: FileList) => {
    setLoading(true);
    const file = files[0];
    const url = URL.createObjectURL(file);
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      setLoading(false);

      return;
    }

    const res = await axios.post(
      `${network}/addLayerImageAPI`,
      {
        idproduct: idProduct,
        token: token,
        file: file,
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

      setUploads([...uploads, upload]);
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

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!);
  };
  useEffect(() => {
    setIsLoading(true);
    setLoading(true);

    async function fetchData() {
      try {
        const response = await axios.post<any>(`${network}/listImage`, {
          token: checkTokenCookie(),
        });
        setTemplates(response.data.data);
        setIsLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const { setCurrentScene, currentScene } = useDesignEditorContext();
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentItem, setCurrentItem] = useState(null);
  // const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const openModal = (event: React.MouseEvent<HTMLDivElement>, item: any) => {
    setModalOpen(true);
    setCurrentItem(item);
    setPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  // const handleContextMenu = (
  //   event: React.MouseEvent<HTMLDivElement>,
  //   item: any
  // ) => {
  //   event.preventDefault();

  //   if (currentItem === null) {
  //     openModal(event, item);
  //   } else if (currentItem !== item) {
  //     setModalOpen(false);
  //     setCurrentItem(item);
  //   }

  //   console.log(currentItem, item);
  // };

  useEffect(() => {
    const handleClickOutside = () => {
      setModalOpen(false);
      setCurrentItem(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleImage = async (item: any) => {
    console.log(item);
    const res = await axios.post(
      `${network}/addLayerImageUrlAPI`,
      {
        idproduct: idProduct,
        token: token,
        imageUrl: item.link,
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
  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    item: any
  ) => {
    event.preventDefault(); // Ngăn chặn hiển thị menu chuột phải mặc định
    // Thực hiện các hành động khi chuột phải vào hình ảnh
    // Ví dụ: hiển thị modal, thêm vào canvas, v.v.
    setModalOpen(true);
    console.log("Context Menu Clicked on", item);
    console.log(event.target);
    setPosition({
      top: event.clientY,
      left: event.clientX,
    });
    setCurrentItem(item);
  };

  const [modalisopen, setmodalisopen] = React.useState(false);
  const [modaldata, setmodaldata] = React.useState(null);

  const addObjectd = async () => {
    setLoading(true);
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
      const options = {
        id: res?.data?.data.id,
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
        },
      };
      editor.objects.add(options);
      setLoading(false);
    }
  };

  const addImageToCanvas = (url: string) => {
    const options = {
      type: "StaticImage",
      src: url,
      metadata: {
        // page: pageId()
      },
    };
    editor.objects.add(options);
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
          }}
        >
          <Block>
            <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
              Tải ảnh lên
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
            <Button
              onClick={handleInputFileRefClick}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Chọn từ máy tính
            </Button>
            <input
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
            />

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => addImageToCanvas(upload.url)}
                >
                  <div>
                    <img
                      width="100px"
                      height="100px"
                      src={upload.url}
                      alt="preview"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Block>
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
            <Block>
              <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                Ảnh bạn đã tải
              </h4>
            </Block>
          </Block>
          <div style={{ padding: "0 1.5rem" }}>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {/* {templates.map((item, index) => {
              return (
                <ImageItem
                  onClick={() => loadTemplate(item)}
                  key={index}
                  preview={`${item.thumbnail}`}
                />
              );
            })} */}

              {templates?.map((item, index) => {
                return (
                  <ImageItem
                    onClick={() => handleImage(item)}
                    key={index}
                    preview={`${item.link}`}
                    onContextMenu={(event) => handleContextMenu(event, item)} // Thêm sự kiện onContextMenuƠ
                    item={item}
                    // isopen={modalisopen}
                  />
                );
              })}
              {modalOpen && (
                <Modal
                  onClose={closeModal}
                  // item={item}
                  // position={position}
                  // onClick={onClick}
                  currentItem={currentItem}
                  onClick={() => handleImage(currentItem)}
                  loadingTrue={() => setLoading(true)}
                  loadingFalse={() => setLoading(false)}
                  pageId={() => parseGraphicJSON()}
                  //           setIsLoading(false);
                  // setLoading(false);
                />
              )}
            </div>
          </div>
        </Scrollable>
      </Block>
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
              src={ezlogo}
              alt=""
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
  onContextMenu,
  item,
}: {
  preview: any;
  onClick?: (option: any) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  item: any;
}) {
  const [css] = useStyletron();

  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={css({
          position: "relative",
          background: "#f8f8fb",
          cursor: "pointer",
          borderRadius: "8px",
          overflow: "hidden",
          "::before:hover": {
            opacity: 1,
          },
        })}
      >
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
          })}
        ></div>
        <img
          src={preview}
          alt=""
          className={css({
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            verticalAlign: "middle",
          })}
        />
      </div>
    </>
  );
}

const Modal = ({
  onClose,
  position,
  currentItem,
  onClick,
  loadingTrue,
  loadingFalse,
  pageId,
}) => {
  // const [css] = useStyletron();
  // const editor = useEditor();

  const proUser = useAppSelector((state) => state.token.proUser);
  const downloadImage = async (fileName: string) => {
    loadingTrue();
    try {
      if (!currentItem || !currentItem.link) {
        throw new Error("Invalid item or missing link");
      }

      // Fetch the image data
      const response = await fetch(currentItem.link);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link); // Append to body to ensure click works in all browsers
      link.click();

      // Release the object URL to free up resources
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link); // Remove from body after click
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      loadingFalse();
    }
  };

  if (!currentItem) {
    return null;
  }
  // const activeObject = use
  const token = useAppSelector((state) => state.token.token);
  const networkAPI = useAppSelector((state) => state.network.ipv4Address);
  const editor = useEditor();
  const activeObject = useActiveObject() as any;
  const {
    setScenes,

    scenes,
  } = useDesignEditorContext();
  async function urlToImageFile(imageUrl: string, fileName: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const imageFile = new File([blob], fileName, { type: blob.type });

      return imageFile;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  }

  const addObject = useCallback(
    (url: string, width: string, height: string, id: any) => {
      if (editor) {
        const options = {
          type: "StaticImage",
          src: url,
          width: width,
          height: height,
          lock: true,
          id: id,
          metadata: {
            page: pageId(),
          },
        };
        editor.objects.add(options);
      }
    },
    [editor]
  );
  const removeBackground = async (storageKey: string) => {
    if (proUser) {
      const srcAttributeValue = currentItem.link;
      // setLoading
      loadingTrue();

      urlToImageFile(srcAttributeValue, "image-local.png").then(
        async (imageFile: File | null) => {
          if (imageFile && token) {
            const formData = new FormData();
            formData.append("image", imageFile); // Assuming 'image' is the key expected by the server for the image file
            formData.append("token", token);
            const headers = {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              "Content-Type": "multipart/form-data",
              // Add any other headers if needed
            };

            const config = {
              headers: headers,
            };

            const response = await axios.post(
              `${networkAPI}/removeBackgroundImageAPI`,
              formData,
              config
            );
            console.log(response.data);
            // editor.objects.add({})
            if (response) {
              const res = await axios.post(
                `${networkAPI}/addLayerImageUrlAPI`,
                {
                  idproduct: idProduct,
                  token: token,
                  imageUrl: response.data.linkOnline,
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log(res.data);

              if (res.data.code === 1) {
                const upload = {
                  id: res.data.data.id,
                  url: res.data.data.content.banner,
                };

                const options = {
                  type: "StaticImage",
                  src: res.data.data.content.banner,
                  id: res.data.data.id,
                };
                loadingFalse();

                // editor.objects.add(options);
                addObject(
                  response.data.linkOnline,
                  currentItem.width,
                  currentItem.height,
                  res.data.data.id
                );
                // console.log(currentItem.link, currentItem.width, currentItem.height, res.data.data.id)
              }
            }
            // editor.objects.remove()
            // editor.objects.
            // editor.canvasId.replace(activeObject.id, editor.objects.update({src: response.data?.linkOnline,id: activeObject.id}))
          } else {
            console.log("Failed to create the image file.");
            loadingFalse();
          }
        }
      );
    } else {
      toast.error(
        "Bạn chưa là tài khoản PRO nên không được truy cập, hãy nâng cấp để dùng nhé !",
        {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
    //    try {
    //   // Read the file into a FormData object
    //   const formData = new FormData();
    //   // formData.append('image', await fs.readFile(filePath));
    //   formData.append("token", token);

    //   // Create the Fetch request
    //   fetch(`${networkAPI}/removeBackgroundImageAPI`, {
    //     method: "POST",
    //     // 'Content-Type': 'multipart/form-data' is set automatically by FormData
    //     // 'Access-Control-Allow-Origin': 'POST', // This should be set on the server, not here
    //     body: formData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data;application/x-www-form-urlencoded;application/json',
    //       // 'Content-Type': ''
    //     }
    //     // mode: "no-cors", // Set the mode to 'no-cors' if needed
    //   })
    //     .then((response) => {
    //       if (response.ok || response.status === 0) {
    //         // You won't be able to log the response details directly in 'no-cors' mode
    //         console.log("Request sent successfully");
    //       } else {
    //         console.error("Request failed");
    //       }
    //     })
    //     .catch((error) => {
    //       // Handle errors
    //       console.error("Error:", error);
    //     });
    // } catch (error) {
    //   console.error(error);
    // }
  };
  // Use ReactDOM.createPortal to render the modal outside the main component tree
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        background: "#fff",
        width: "160px",
        border: "1px solid #ccc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        cursor: "pointer",
        boxSizing: "border-box", // Thêm box-sizing để tính toán kích thước đúng
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* */}
      <div className="my-div" onClick={onClick}>
        <img src="./check.png" alt="" style={{ width: 15, height: 15 }} />
        {"\u00A0"}Sử dụng
      </div>
      {/*  */}
      <div className="my-div" onClick={() => removeBackground("storageKey")}>
        <img
          src="./magic-wand (1).png"
          alt=""
          style={{ width: 15, height: 15 }}
        />
        {"\u00A0"}Xóa nền
        <img
          src="../../../../../../assets/premium.png"
          style={{
            width: 15,
            height: 15,
            resize: "block",
            marginBottom: "10%",
            marginLeft: "3",
          }}
        />
      </div>
      {/* onClick={() => downloadImage("download.png")} */}
      <div className="my-div" onClick={() => downloadImage("download.png")}>
        <Image
          src="https://cdn-icons-png.flaticon.com/512/2550/2550221.png"
          alt=""
          width={15}
          height={15}
        />
        {"\u00A0"}Tải về
      </div>

      {/* Add your modal content here */}
    </div>,
    document.body
  );
};
