"use client";
import React, { useState } from "react";
import { useActiveObject, useEditor, useObjects } from "@layerhub-io/react";
import { Block } from "baseui/block";
import { Input } from "baseui/input";
import { Slider } from "baseui/slider";
import { Button, SIZE, KIND } from "baseui/button";
import { PLACEMENT, StatefulPopover } from "baseui/popover";
import { StatefulTooltip } from "baseui/tooltip";
import SliderBox from "@mui/material/Slider";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import { toast } from "react-toastify";
import { ILayer } from "@layerhub-io/types";
// import Image from "next/image";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  ROLE,
} from "baseui/modal";
import Cropper from "react-easy-crop";

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

  if (tokenCookie) {
    return tokenCookie.replace(/^"|"$/g, "");
  } else {
  }
}

export default function Flip() {
  const editor = useEditor();
  const objects = useObjects() as ILayer[];

  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);
  console.log('🚀 ~ Flip ~ layerObjects:', layerObjects)
  const idProduct = useAppSelector((state) => state.token.id);
  const token1 = checkTokenCookie();
  const activeObject = useActiveObject() as any;
  const [state, setState] = React.useState({ flipX: false, flipY: false });
  const [stated, setStated] = React.useState({ opacity: 1 });
  const networkAPI = useAppSelector((state) => state.network.ipv4Address);
  const [angle, setAngle] = React.useState(0);

  const [sizeInitial, setSizeInitial] = React.useState({
    width: 0,
    height: 0,
  });
  const [distance, setDistance] = React.useState({
    left: 0,
    top: 0,
  });
  const [scale, setScale] = React.useState({
    scaleX: 0,
    scaleY: 0,
  });

  React.useEffect(() => {
    if (objects) {
      setLayerObjects(objects);
    }
  }, [objects]);
  // const token = useAppSelector((state) => state.token.token);
  const token = checkTokenCookie();
  React.useEffect(() => {
    if (activeObject) {
      setState({
        flipX: activeObject.flipX,
        flipY: activeObject.flipY,
      });
      setAngle(activeObject.angle);
      setSizeInitial({
        width: activeObject.width,
        height: activeObject.height,
      });
      setDistance({
        left: activeObject.left,
        top: activeObject.top,
      });
      setScale({
        scaleX: Math.abs(activeObject.scaleX),
        scaleY: Math.abs(activeObject.scaleX),
      });
    }
  }, [activeObject]);
  React.useEffect(() => {
    let watcher = async () => {
      if (objects) {
        setLayerObjects([...objects]);
      }
    };
    if (editor) {
      editor.on("history:changed", watcher);
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher);
      }
    };
  }, [editor, objects]);
  // Gọi hàm với URL blob và tên khóa tùy chọn
  // var imageUrl = 'URL_CUA_IMAGE_BLOB';
  // var storageKey = 'ten_khoa_luu';
  // saveBlobImageToLocal(imageUrl, storageKey);
  const proUser = useAppSelector((state) => state.token.proUser);

  const flipHorizontally = React.useCallback(async() => {
    editor.objects.update({ flipX: !state.flipX });
    setState({ ...state, flipX: !state.flipX });
    try {
      const response = await axios.post('https://apis.ezpics.vn/apis/updateLayerAPI', {
        idproduct: idProduct,
        token: token1,
        field: 'lat_anh',
        value: !state.flipX ? 1 : 0,
        idlayer: `${activeObject.id}`
      })
    } catch (error) {
      console.log(error);
    }
  }, [editor, state]);
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
  const removeBackground = async (storageKey: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (proUser) {
      const srcAttributeValue =
        activeObject._element.getAttribute("src") === ""
          ? activeObject._element.getAttribute("currentSrc")
          : activeObject._element.getAttribute("src");
      console.log(srcAttributeValue);
      urlToImageFile(srcAttributeValue, "image-local.png").then(
        async (imageFile: File | null) => {
          if (imageFile && token) {
            const formData = new FormData();
            formData.append("image", imageFile);
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
            console.log("response", response);
            const newOptions = {
              id: activeObject.id,
              name: "StaticImage",
              angle: activeObject.angle,
              stroke: activeObject.stroke,
              strokeWidth: activeObject.strokeWidth,
              left: activeObject.left,
              top: activeObject.top,
              opacity: activeObject.opacity,
              originX: activeObject.originX,
              originY: activeObject.originY,
              scaleX: activeObject.scaleX,
              // img.naturalWidth,
              scaleY: activeObject.scaleY,
              // img.naturalWidth,
              // data.width,
              type: "StaticImage",
              flipX: activeObject.flipX,
              flipY: activeObject.flipY,
              skewX: activeObject.skewX,
              skewY: activeObject.skewY,
              visible: activeObject.visible,
              shadow: activeObject.shadow,
              src: response.data?.linkOnline,
              cropX: activeObject.cropX,
              cropY: activeObject.cropY,
              image_svg: "",
              metadata: {
                naturalWidth: activeObject.metadata.naturalWidth,
                naturalHeight: activeObject.metadata.naturalHeight,
                initialHeight: activeObject.metadata.initialHeight,
                initialWidth: activeObject.metadata.initialWidth,
                lock: activeObject.metadata.lock,
                variable: activeObject.metadata.variable,
                variableLabel: activeObject.metadata.variableLabel,
                brightness: activeObject.metadata.brightness,
                sort: activeObject.metadata.sort,
              },
            };
            editor.objects.remove();
            editor.objects.add(newOptions);
            layerObjects.map((layer, index) => {
              // Nếu số thứ tự của object không bằng với sort, tiếp tục đẩy về phía sau
              if (index !== activeObject.metadata.sort) {
                editor.objects.sendToBack();
                // Cập nhật lại số thứ tự của object sau khi đẩy về phía sau
                index = layerObjects.findIndex((obj) => obj === layer);
              }
              console.log(activeObject.metadata.sort); // In ra sort khi nó đúng với số thứ tự của object
            });
          } else {
            console.log("Failed to create the image file.");
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
  };
  const [sliderValue, setSliderValue] = React.useState(0.00000005);

  // const handleSliderChange = (event: Event, newValue: number | number[]) => {
  //   setSliderValue(newValue as number);
  //   console.log(newValue);
  //   editor.objects.update({ scaleX: newValue, scaleY: newValue });
  // };
  const flipVertically = React.useCallback(async() => {
    editor.objects.update({ flipY: !state.flipY });
    setState({ ...state, flipY: !state.flipY });
    // try {
    //   const response = await axios.post('https://apis.ezpics.vn/apis/updateLayerAPI', {
    //     idproduct: idProduct,
    //     token: token1,
    //     field: 'lat_anh',
    //     value: !state.flipY ? 1 : 0,
    //     idlayer: `${activeObject.id}`
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
  }, [editor, state]);

  const changingBrightness = React.useCallback(() => {
    editor.objects.update({ flipY: !state.flipY });
    setState({ ...state, flipY: !state.flipY });
  }, [editor, state]);
  const onChange = React.useCallback(
    (value: number) => {
      setStated({ opacity: value });
      editor.objects.update({ opacity: value / 100 });
    },
    [editor]
  );
  function valuetext(value: number) {
    return `${value}°C`;
  }
  const [sliderValued, setSliderValued] = React.useState(0);

  const handleSliderChanged = (event: Event, newValue: number | number[]) => {
    setSliderValued(newValue as number);
    console.log(sliderValue);
    setAngle(newValue);

    editor.objects.update({ scaleX: newValue, scaleY: newValue });
    // editor.objects.update({ angle: newValue });
  };

  //Cắt ảnh
  let maxWidth = null;
  let maxHeight = null;

  try {
    if (
      activeObject &&
      activeObject.width !== undefined &&
      activeObject.height !== undefined
    ) {
      maxWidth = activeObject.width;
      maxHeight = activeObject.height;
    } else {
      throw new Error(
        "activeObject is null or does not have required properties."
      );
    }
  } catch (error) {
    console.error("Error");
  }

  const [cropX, setCropX] = React.useState({ cropX: 0 });

  const handleSetCropX = React.useCallback(
    (value: number) => {
      const newCropX = (value / 100) * maxWidth;
      setCropX({ cropX: newCropX });
      editor.objects.update({ cropX: newCropX });
    },
    [editor, maxWidth]
  );

  const [cropY, setCropY] = React.useState({ cropY: 0 });

  const handleSetCropY = React.useCallback(
    (value: number) => {
      const newCropY = (value / 100) * maxHeight;
      setCropY({ cropY: newCropY });
      editor.objects.update({ cropY: newCropY });
    },
    [editor, maxHeight]
  );

  //Crop image modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <StatefulPopover placement={PLACEMENT.bottom} content={undefined}>
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}>
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={flipVertically}>
            Lật ảnh dọc
          </Button>
        </StatefulTooltip>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}>
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={flipHorizontally}>
            Lật ảnh ngang
          </Button>
        </StatefulTooltip>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}>
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={() => removeBackground("storageKey")}
            style={{ paddingRight: 5 }}>
            Xóa nền
            <img
              src="/assets/premium.png"
              style={{
                resize: "block",
                marginBottom: "20%",
                marginLeft: "3",
                width: "15px",
                height: "15px",
              }}
              alt=""
            />
          </Button>
        </StatefulTooltip>

        {/* Bo goc */}
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Block $style={{ fontSize: "14px" }}>Bo góc</Block>
                <Block width={"52px"}>
                  <Input
                    overrides={{
                      Input: {
                        style: {
                          backgroundColor: "#ffffff",
                          textAlign: "center",
                        },
                      },
                      Root: {
                        style: {
                          borderBottomColor: "rgba(0,0,0,0.15)",
                          borderTopColor: "rgba(0,0,0,0.15)",
                          borderRightColor: "rgba(0,0,0,0.15)",
                          borderLeftColor: "rgba(0,0,0,0.15)",
                          borderTopWidth: "1px",
                          borderBottomWidth: "1px",
                          borderRightWidth: "1px",
                          borderLeftWidth: "1px",
                          height: "26px",
                        },
                      },
                      InputContainer: {},
                    }}
                    size={SIZE.mini}
                    onChange={() => {}}
                    value={Math.round(stated.opacity)}
                  />
                </Block>
              </Block>

              <Block>
                <Slider
                  overrides={{
                    InnerThumb: () => null,
                    ThumbValue: () => null,
                    TickBar: () => null,
                    Track: {
                      style: {
                        paddingRight: 0,
                        paddingLeft: 0,
                      },
                    },
                    Thumb: {
                      style: {
                        height: "12px",
                        width: "12px",
                      },
                    },
                  }}
                  min={0}
                  max={100}
                  marks={false}
                  value={[stated.opacity]}
                  // @ts-ignore
                  onChange={({ value }) => onChange(value)}
                />
              </Block>
            </Block>
          )}>
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Bo góc
          </Button>
        </StatefulPopover>

        {/* Do sang */}
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Block $style={{ fontSize: "14px" }}>Độ sáng</Block>
                <Block width={"52px"}>
                  <Input
                    overrides={{
                      Input: {
                        style: {
                          backgroundColor: "#ffffff",
                          textAlign: "center",
                        },
                      },
                      Root: {
                        style: {
                          borderBottomColor: "rgba(0,0,0,0.15)",
                          borderTopColor: "rgba(0,0,0,0.15)",
                          borderRightColor: "rgba(0,0,0,0.15)",
                          borderLeftColor: "rgba(0,0,0,0.15)",
                          borderTopWidth: "1px",
                          borderBottomWidth: "1px",
                          borderRightWidth: "1px",
                          borderLeftWidth: "1px",
                          height: "26px",
                        },
                      },
                      InputContainer: {},
                    }}
                    size={SIZE.mini}
                    onChange={() => {}}
                    value={Math.round(stated.opacity)}
                  />
                </Block>
              </Block>

              <Block>
                <Slider
                  overrides={{
                    InnerThumb: () => null,
                    ThumbValue: () => null,
                    TickBar: () => null,
                    Track: {
                      style: {
                        paddingRight: 0,
                        paddingLeft: 0,
                      },
                    },
                    Thumb: {
                      style: {
                        height: "12px",
                        width: "12px",
                      },
                    },
                  }}
                  min={0}
                  max={100}
                  marks={false}
                  value={[stated.opacity]}
                  // @ts-ignore
                  onChange={({ value }) => onChange(value)}
                />
              </Block>
            </Block>
          )}>
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Độ sáng
          </Button>
        </StatefulPopover>
        {/* <TransitionElement /> */}

        {/* cat anh ngang doc */}
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Block $style={{ fontSize: "14px" }}>Chiều ngang</Block>
                <Block width={"52px"}>
                  <Input
                    overrides={{
                      Input: {
                        style: {
                          backgroundColor: "#ffffff",
                          textAlign: "center",
                        },
                      },
                      Root: {
                        style: {
                          borderBottomColor: "rgba(0,0,0,0.15)",
                          borderTopColor: "rgba(0,0,0,0.15)",
                          borderRightColor: "rgba(0,0,0,0.15)",
                          borderLeftColor: "rgba(0,0,0,0.15)",
                          borderTopWidth: "1px",
                          borderBottomWidth: "1px",
                          borderRightWidth: "1px",
                          borderLeftWidth: "1px",
                          height: "26px",
                        },
                      },
                      InputContainer: {},
                    }}
                    size={SIZE.mini}
                    onChange={() => {}}
                    value={Math.round((cropX.cropX / maxWidth) * 100)}
                  />
                </Block>
              </Block>

              <Block>
                <Slider
                  overrides={{
                    InnerThumb: () => null,
                    ThumbValue: () => null,
                    TickBar: () => null,
                    Track: {
                      style: {
                        paddingRight: 0,
                        paddingLeft: 0,
                      },
                    },
                    Thumb: {
                      style: {
                        height: "12px",
                        width: "12px",
                      },
                    },
                  }}
                  min={0}
                  max={100}
                  marks={false}
                  value={[Math.round((cropX.cropX / maxWidth) * 100)]}
                  onChange={({ value }) => handleSetCropX(value)}
                />
              </Block>

              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Block $style={{ fontSize: "14px" }}>Chiều dọc</Block>
                <Block width={"52px"}>
                  <Input
                    overrides={{
                      Input: {
                        style: {
                          backgroundColor: "#ffffff",
                          textAlign: "center",
                        },
                      },
                      Root: {
                        style: {
                          borderBottomColor: "rgba(0,0,0,0.15)",
                          borderTopColor: "rgba(0,0,0,0.15)",
                          borderRightColor: "rgba(0,0,0,0.15)",
                          borderLeftColor: "rgba(0,0,0,0.15)",
                          borderTopWidth: "1px",
                          borderBottomWidth: "1px",
                          borderRightWidth: "1px",
                          borderLeftWidth: "1px",
                          height: "26px",
                        },
                      },
                      InputContainer: {},
                    }}
                    size={SIZE.mini}
                    onChange={() => {}}
                    value={Math.round((cropY.cropY / maxHeight) * 100)}
                  />
                </Block>
              </Block>

              <Block>
                <Slider
                  overrides={{
                    InnerThumb: () => null,
                    ThumbValue: () => null,
                    TickBar: () => null,
                    Track: {
                      style: {
                        paddingRight: 0,
                        paddingLeft: 0,
                      },
                    },
                    Thumb: {
                      style: {
                        height: "12px",
                        width: "12px",
                      },
                    },
                  }}
                  min={0}
                  max={100}
                  marks={false}
                  value={[Math.round((cropY.cropY / maxHeight) * 100)]}
                  onChange={({ value }) => handleSetCropY(value)}
                />
              </Block>
            </Block>
          )}>
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Cắt ảnh
          </Button>
        </StatefulPopover>

        {/* test crop image */}
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}>
          <Button size={SIZE.compact} kind={KIND.tertiary} onClick={openModal}>
            Crop image
          </Button>
        </StatefulTooltip>

        <ModalCropImage isOpen={isModalOpen} onClose={closeModal} />
      </Block>
    </StatefulPopover>
  );
}

function dataURLToBlob(dataURL) {
  const parts = dataURL.split(",");
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function ModalCropImage({ isOpen, onClose }) {
  const editor = useEditor();
  const activeObject = useActiveObject() as any;
  const [image, setImage] = React.useState("");
  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);
  const objects = useObjects() as ILayer[];

  React.useEffect(() => {
    if (objects) {
      setLayerObjects(objects);
      console.log(objects);
    }
  }, [objects]);

  React.useEffect(() => {
    let watcher = async () => {
      if (objects) {
        setLayerObjects([...objects]);
      }
    };
    if (editor) {
      editor.on("history:changed", watcher);
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher);
      }
    };
  }, [editor, objects]);

  React.useEffect(() => {
    if (activeObject) {
      console.log(activeObject);
      const srcAttributeValue =
        activeObject._element?.getAttribute("src") === ""
          ? activeObject._element?.getAttribute("currentSrc")
          : activeObject._element?.getAttribute("src");
      setImage(srcAttributeValue);
    }
  }, [activeObject]);

  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const [croppedArea, setCroppedArea] = React.useState(null);
  const [ratio, setRatio] = React.useState(4 / 3);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onRatioChange = (e) => {
    setRatio(e.target.value);
  };

  const [imageAfterCrop, setImageAfterCrop] = React.useState("");

  const idProduct = useAppSelector((state) => state?.token?.id);

  const onCropDone = (imgcroppedArea) => {
    const canvasFile = document.createElement("canvas");
    canvasFile.width = imgcroppedArea.width;
    canvasFile.height = imgcroppedArea.height;

    const context = canvasFile.getContext("2d");
    var imageObj = new Image();
    imageObj.crossOrigin = "Anonymous";
    imageObj.src = image;
    imageObj.onload = async function () {
      context?.drawImage(
        imageObj,
        imgcroppedArea.x,
        imgcroppedArea.y,
        imgcroppedArea.width,
        imgcroppedArea.height,
        0,
        0,
        imgcroppedArea.width,
        imgcroppedArea.height
      );

      const dataUrl = canvasFile.toDataURL("image/png");
      const imageBlob: Blob = dataURLToBlob(dataUrl);
      const token = checkTokenCookie();
      const formData = new FormData();
      formData.append("idproduct", idProduct);
      formData.append("token", token);
      formData.append("idlayer", activeObject.id);
      formData.append("file", imageBlob);
      console.log(formData);

      //Chuyen thay doi anh api
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
        "https://apis.ezpics.vn/apis/changeLayerImageNew",
        formData,
        config
      );
      console.log(response);
      if (response && response?.data?.code === 1) {
        const newOptions = {
          id: activeObject.id,
          name: "StaticImage",
          angle: activeObject.angle,
          stroke: activeObject.stroke,
          strokeWidth: activeObject.strokeWidth,
          left: activeObject.left,
          top: activeObject.top,
          opacity: activeObject.opacity,
          originX: activeObject.originX,
          originY: activeObject.originY,
          scaleX: activeObject.scaleX,
          // img.naturalWidth,
          scaleY: activeObject.scaleY,
          // img.naturalWidth,
          // data.width,
          type: "StaticImage",
          flipX: activeObject.flipX,
          flipY: activeObject.flipY,
          skewX: activeObject.skewX,
          skewY: activeObject.skewY,
          visible: activeObject.visible,
          shadow: activeObject.shadow,
          src: response.data?.link,
          cropX: activeObject.cropX,
          cropY: activeObject.cropY,
          image_svg: "",
          metadata: {
            naturalWidth: imgcroppedArea.width,
            naturalHeight: imgcroppedArea.height,
            initialHeight: imgcroppedArea.height,
            initialWidth: imgcroppedArea.width,
            lock: activeObject.metadata.lock,
            variable: activeObject.metadata.variable,
            variableLabel: activeObject.metadata.variableLabel,
            brightness: activeObject.metadata.brightness,
            sort: activeObject.metadata.sort,
          },
        };

        editor.objects.remove();
        editor.objects.add(newOptions);

        layerObjects.map((layer, index) => {
          // Nếu số thứ tự của object không bằng với sort, tiếp tục đẩy về phía sau
          if (index !== activeObject.metadata.sort) {
            editor.objects.sendToBack();
            // Cập nhật lại số thứ tự của object sau khi đẩy về phía sau
            index = layerObjects.findIndex((obj) => obj === layer);
          }
          console.log(activeObject.metadata.sort); // In ra sort khi nó đúng với số thứ tự của object
        });
      }
    };
  };

  return (
    <Modal
      onClose={onClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
      overrides={{
        Root: {
          style: {
            zIndex: 5,
          },
        },
        Dialog: {
          style: {
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            width: "500px",
            height: "400px",
          },
        },
      }}>
      <ModalBody>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={ratio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              width: "90%",
              height: "80%",
              backgroundColor: "#fff",
              marginRight: "auto",
              marginLeft: "auto",
              marginTop: "10px",
            },
          }}
        />

        <Button
          style={{ position: "absolute", bottom: "0", margin: "10px 0px" }}
          onClick={() => onCropDone(croppedArea)}>
          Crop
        </Button>
      </ModalBody>
    </Modal>
  );
}

export function TransitionElement() {
  const editor = useEditor();
  const activeObject = useActiveObject();
  const [state, setState] = React.useState<{ align: string }>({
    align: "left",
  });

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      setState({ align: activeObject.textAlign });
    }
  }, [activeObject]);
  return (
    <StatefulPopover
      showArrow={true}
      placement={PLACEMENT.bottom}
      content={() => (
        <Block
          padding={"12px"}
          backgroundColor={"#ffffff"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr 1fr"}
          gridGap={"8px"}>
          <Button
            // isSelected={state.align === TEXT_ALIGNS[0]}
            // onClick={() => {
            //   // @ts-ignore
            //   editor.objects.update({ textAlign: TEXT_ALIGNS[0] });
            //   setState({ align: TEXT_ALIGNS[0] });
            // }}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <img
              src="../../../../../../assets/moveleft.png"
              style={{ width: "15px", height: "15px" }}
            />
          </Button>
          <Button
            // isSelected={state.align === TEXT_ALIGNS[1]}
            // onClick={() => {
            //   // @ts-ignore
            //   editor.objects.update({ textAlign: TEXT_ALIGNS[1] });
            //   setState({ align: TEXT_ALIGNS[1] });
            // }}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <img
              src="../../../../../../assets/moveright.png"
              style={{ width: "30px", height: "auto" }}
            />
          </Button>
          <Button
            // isSelected={state.align === TEXT_ALIGNS[2]}
            // onClick={() => {
            //   // @ts-ignore
            //   editor.objects.update({ textAlign: TEXT_ALIGNS[2] });
            //   setState({ align: TEXT_ALIGNS[2] });
            // }}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <img
              src="../../../../../../assets/movebottom.png"
              style={{ width: "15px", height: "auto" }}
            />
          </Button>
          <Button
            // isSelected={state.align === TEXT_ALIGNS[3]}
            // onClick={() => {
            //   // @ts-ignore
            //   editor.objects.update({ textAlign: TEXT_ALIGNS[3] });
            //   setState({ align: TEXT_ALIGNS[3] });
            // }}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <img
              src="../../../../../../assets/movetop.png"
              style={{ width: "17px", height: "auto" }}
            />
          </Button>
        </Block>
      )}
      returnFocus
      autoFocus>
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}>
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            // onClick={flipHorizontally}
          >
            Lật ảnh ngang
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  );
}
