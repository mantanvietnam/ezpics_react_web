"use client";
import React, { useState } from "react";
import { useActiveObject, useEditor, useObjects } from "@layerhub-io/react";
import { Block } from "baseui/block";
import { Input } from "baseui/input";
import { Slider } from "baseui/slider";
import { Button, SIZE, KIND } from "baseui/button";
import { PLACEMENT, StatefulPopover } from "baseui/popover";
import { StatefulTooltip, TRIGGER_TYPE } from "baseui/tooltip";
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

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useStyletron } from "baseui";

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
  console.log("🚀 ~ Flip ~ layerObjects:", layerObjects);
  const idProduct = useAppSelector((state) => state.token.id);
  const token1 = checkTokenCookie();
  const activeObject = useActiveObject() as any;
  console.log("🚀 ~ Flip ~ activeObject:", activeObject);
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

  const flipHorizontally = React.useCallback(async () => {
    editor.objects.update({ flipX: !state.flipX });
    setState({ ...state, flipX: !state.flipX });
    try {
      const response = await axios.post(
        "https://apis.ezpics.vn/apis/updateLayerAPI",
        {
          idproduct: idProduct,
          token: token1,
          field: "lat_anh",
          value: !state.flipX ? 1 : 0,
          idlayer: `${activeObject.id}`,
        }
      );
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
  const flipVertically = React.useCallback(async () => {
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
    setAngle(newValue as number);

    editor.objects.update({ scaleX: newValue, scaleY: newValue });
    // editor.objects.update({ angle: newValue });
  };

  //Crop image modal
  const [isModalCropOpen, setIsModalCropOpen] = React.useState(false);

  const openModalCrop = () => {
    setIsModalCropOpen(true);
  };

  const closeModalCrop = () => {
    setIsModalCropOpen(false);
  };

  //Change image modal
  const [isModalChangeOpen, setIsModaChangelOpen] = React.useState(false);

  const openModalChange = () => {
    setIsModaChangelOpen(true);
  };

  const closeModalChange = () => {
    setIsModaChangelOpen(false);
  };

  //Change image modal
  const [isModalChangeOpenNew, setIsModaChangelOpenNew] = React.useState(false);

  const openModalChangeNew = () => {
    setIsModaChangelOpenNew(true);
  };

  const closeModalChangeNew = () => {
    setIsModaChangelOpenNew(false);
  };

  return (
    <>
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
              <Block
                width={"200px"}
                backgroundColor={"#ffffff"}
                padding={"20px"}>
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
              <Block
                width={"200px"}
                backgroundColor={"#ffffff"}
                padding={"20px"}>
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

          {/*crop image */}
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            showArrow={true}
            accessibilityType={"tooltip"}>
            <Button
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={openModalCrop}>
              Cắt ảnh
            </Button>
          </StatefulTooltip>

          <ModalImageCrop isOpen={isModalCropOpen} onClose={closeModalCrop} />

          {/* thay anh */}
          <StatefulTooltip
            placement={PLACEMENT.bottomLeft}
            triggerType={TRIGGER_TYPE.click}
            overrides={{
              Inner: {
                style: ({ $theme }) => ({
                  backgroundColor: "#fff",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                  paddingRight: "0px",
                  paddingLeft: "0px",
                }),
              },
            }}
            content={() => (
              <Block width={"200px"} backgroundColor={"#fff"} padding={"20px"}>
                <Button
                  onClick={() => openModalChangeNew()}
                  style={{ fontSize: "14px" }}>
                  Chọn ảnh từ thiết bị
                </Button>
                <Button
                  style={{ marginTop: "10px", fontSize: "14px" }}
                  onClick={() => openModalChange()}>
                  Chọn ảnh có sẵn
                </Button>
              </Block>
            )}>
            <Button size={SIZE.compact} kind={KIND.tertiary}>
              Thay ảnh
            </Button>
          </StatefulTooltip>

          <ModalChangeImageNew
            isOpen={isModalChangeOpenNew}
            onClose={closeModalChangeNew}></ModalChangeImageNew>

          <ModalChangeImage
            isOpen={isModalChangeOpen}
            onClose={closeModalChange}></ModalChangeImage>
        </Block>
      </StatefulPopover>
    </>
  );
}

function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error("Invalid data URL");
  }

  const mime = mimeMatch[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalImageCrop({ isOpen, onClose }: ModalProps) {
  const editor = useEditor();
  const objects = useObjects() as ILayer[];
  const [loading, setLoading] = React.useState(false);

  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);

  const imgRef = React.useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = React.useState("");
  const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const hiddenAnchorRef = React.useRef<HTMLAnchorElement>(null);
  const blobUrlRef = React.useRef("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [scale, setScale] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);
  const [aspect, setAspect] = React.useState<number | undefined>(undefined);

  const activeObject = useActiveObject() as any;

  React.useEffect(() => {
    if (activeObject) {
      const srcAttributeValue =
        activeObject?._element?.getAttribute("src") === ""
          ? activeObject?._element?.getAttribute("currentSrc")
          : activeObject?._element?.getAttribute("src");
      setImgSrc(srcAttributeValue);
    }
  }, [activeObject]);

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

  const idProduct = useAppSelector((state) => state?.token?.id);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(aspect, width, height));
    }
  }

  function onCropComplete() {
    setLoading(true);
    const image = imgRef.current;
    if (!completedCrop || !image) {
      setLoading(false);
      throw new Error("Crop canvas does not exist");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvasFile = document.createElement("canvas");
    const width = Math.round(completedCrop.width * scaleX);
    const height = Math.round(completedCrop.height * scaleY);
    canvasFile.width = width;
    canvasFile.height = height;
    const context = canvasFile.getContext("2d");
    var imageObj = new Image();
    imageObj.crossOrigin = "Anonymous";
    imageObj.src = imgSrc;

    imageObj.onload = async function () {
      const x = Math.round(completedCrop.x * scaleX);
      const y = Math.round(completedCrop.y * scaleY);

      if (!context) {
        throw new Error("No 2d context");
      }

      context?.drawImage(imageObj, x, y, width, height, 0, 0, width, height);
      const dataUrl = canvasFile.toDataURL("image/png");

      const imageBlob: Blob = dataURLToBlob(dataUrl);
      const token = checkTokenCookie();

      const formData = new FormData();

      if (token) {
        formData.append("idproduct", idProduct);
        formData.append("token", token);
        formData.append("idlayer", activeObject.id);
        formData.append("file", imageBlob);
        console.log(formData);
      }

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
            naturalWidth: width,
            naturalHeight: height,
            initialHeight: height,
            initialWidth: width,
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
  }

  return (
    <>
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
              width: "auto",
              height: "auto",
            },
          },
        }}>
        <ModalBody>
          <div className="w-[300px] md:w-[400px] lg:w-[600px]">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(_)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              // minWidth={400}
              minHeight={50}
              // circularCrop
            >
              <img
                alt="Crop me"
                src={imgSrc}
                ref={imgRef}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        </ModalBody>
        <ModalFooter>
          {loading ? (
            <Button isLoading>Loading</Button>
          ) : (
            <Button onClick={() => onCropComplete()}>Cắt ảnh</Button>
          )}
        </ModalFooter>
      </Modal>
    </>
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

export function ModalChangeImageNew({ isOpen, onClose }: ModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  const token = checkTokenCookie();
  const idProduct = useAppSelector((state) => state?.token?.id);
  const activeObject = useActiveObject() as any;

  const editor = useEditor();
  const objects = useObjects() as ILayer[];
  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);

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

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(file);
    }
  };
  const onChangeImage = async () => {
    setLoading(true);
    if (!selectedFile) {
      setLoading(false);
      console.error("No file selected");
      return;
    }

    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFileTypes.includes(selectedFile.type)) {
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }

    const formData = new FormData();

    if (token) {
      formData.append("idproduct", idProduct);
      formData.append("token", token);
      formData.append("idlayer", activeObject.id);
      formData.append("file", selectedFile);
      console.log(formData);
    }

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
    };

    const config = {
      headers: headers,
    };

    try {
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
          if (index !== activeObject.metadata.sort) {
            editor.objects.sendToBack();
            index = layerObjects.findIndex((obj) => obj === layer);
          }
          console.log(activeObject.metadata.sort);
        });
      }
    } catch (error) {
      console.error("Error when making POST request:", error);
    }
  };

  return (
    <>
      <Modal
        onClose={() => {
          onClose();
          setImgSrc("");
        }}
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
              width: "auto",
              height: "auto",
            },
          },
        }}>
        <ModalBody>
          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {!!imgSrc && <img alt="Change me" src={imgSrc} />}
          </div>
        </ModalBody>
        <ModalFooter>
          {loading ? (
            <Button isLoading>Loading</Button>
          ) : (
            <Button onClick={() => onChangeImage()}>Thay ảnh</Button>
          )}
        </ModalFooter>
      </Modal>
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
        })}>
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
          })}></div>
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

export function ModalChangeImage({ isOpen, onClose }: ModalProps) {
  const [templates, setTemplates] = useState<any[]>([]);

  const token = checkTokenCookie();
  const idProduct = useAppSelector((state) => state?.token?.id);
  const activeObject = useActiveObject() as any;

  const editor = useEditor();
  const objects = useObjects() as ILayer[];
  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);

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

  const handleImageClick = async (id: any) => {
    console.log("Selected Image Id:", id);

    const formData = new FormData();

    const widthImage = activeObject.metadata.naturalWidth;

    if (token) {
      formData.append("idproduct", idProduct);
      formData.append("token", token);
      formData.append("idlayer", activeObject.id);
      formData.append("idfile", id);
      formData.append("width", widthImage);
      console.log(formData);
    }

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
    };

    const config = {
      headers: headers,
    };

    try {
      const response = await axios.post(
        "https://apis.ezpics.vn/apis/changeLayerImageAPI",
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
      }
    } catch (error) {
      console.error("Error when making POST request:", error);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post<any>(
          `https://apis.ezpics.vn/apis/listImage`,
          {
            token: checkTokenCookie(),
          }
        );
        setTemplates(response.data.data.reverse());
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Modal
        onClose={() => {
          onClose();
        }}
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
              marginTop: "20px",
              marginLeft: 0,
              marginRight: 0,
              marginBottom: "20px",
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              width: "1000px",
              height: "auto",
            },
          },
        }}>
        <ModalBody>
          <div style={{ padding: "0 1.5rem" }}>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "3fr 3fr 3fr 3fr 3fr",
              }}>
              {templates?.map((item, index) => {
                return (
                  <ImageItem
                    key={index}
                    preview={`${item.link}`}
                    item={item}
                    onClick={() => handleImageClick(item.id)}
                  />
                );
              })}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
