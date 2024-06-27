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
import Image from "next/image";

export default function Flip() {
  const editor = useEditor();
  const objects = useObjects() as ILayer[];

  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);

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
      console.log(objects);
    }
  }, [objects]);
  const token = useAppSelector((state) => state.token.token);
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
      console.log(distance, sizeInitial);
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

  const flipHorizontally = React.useCallback(() => {
    editor.objects.update({ flipX: !state.flipX });
    setState({ ...state, flipX: !state.flipX });
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
            console.log(srcAttributeValue);
            console.log(activeObject);
            console.log(response.data?.linkOnline);
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
  const [sliderValue, setSliderValue] = React.useState(0.00000005);

  // const handleSliderChange = (event: Event, newValue: number | number[]) => {
  //   setSliderValue(newValue as number);
  //   console.log(newValue);
  //   editor.objects.update({ scaleX: newValue, scaleY: newValue });
  // };
  const flipVertically = React.useCallback(() => {
    editor.objects.update({ flipY: !state.flipY });
    setState({ ...state, flipY: !state.flipY });
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
  return (
    <StatefulPopover placement={PLACEMENT.bottom}>
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
        >
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={flipVertically}
          >
            Lật ảnh dọc
          </Button>
        </StatefulTooltip>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
        >
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={flipHorizontally}
          >
            Lật ảnh ngang
          </Button>
        </StatefulTooltip>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
        >
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={() => removeBackground("storageKey")}
            style={{ paddingRight: 5 }}
          >
            Xóa nền
            <img
              src="../../../../../../assets/premium.png"
              style={{
                width: 15,
                height: 15,
                resize: "block",
                marginBottom: "20%",
                marginLeft: "3",
              }}
            />
          </Button>
        </StatefulTooltip>
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
          )}
        >
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Bo góc
          </Button>
        </StatefulPopover>
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
          )}
        >
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Độ sáng
          </Button>
        </StatefulPopover>
        {/* <TransitionElement /> */}

        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block
              padding={"12px"}
              backgroundColor={"#ffffff"}
              display={"grid"}
              gridTemplateColumns={"1fr 1fr 1fr 1fr"}
              gridGap={"8px"}
            >
              <Button
                // isSelected={state.align === TEXT_ALIGNS[0]}
                // onClick={() => {
                //   // @ts-ignore
                //   editor.objects.update({ textAlign: TEXT_ALIGNS[0] });
                //   setState({ align: TEXT_ALIGNS[0] });
                // }}
                kind={KIND.tertiary}
                size={SIZE.mini}
                onClick={() => {
                  // @ts-ignore
                  editor.objects.update({ left: distance.left - 5 });
                  setDistance({ ...distance, left: distance.left - 5 });
                }}
              >
                <Image
                  alt=""
                  src="../../../../../../assets/moveleft.png"
                  width="15"
                  height= "15"
                />
              </Button>
              <Button
                // isSelected={state.align === TEXT_ALIGNS[1]}
                onClick={() => {
                  // @ts-ignore
                  editor.objects.update({ left: distance.left + 5 });
                  setDistance({ ...distance, left: distance.left + 5 });
                }}
                kind={KIND.tertiary}
                size={SIZE.mini}
              >
                <Image
                  src="../../../../../../assets/moveright.png"
                  alt=""
                  style={{ width: "30px", height: "auto" }}
                />
              </Button>
              <Button
                // isSelected={state.align === TEXT_ALIGNS[2]}
                onClick={() => {
                  // @ts-ignore
                  editor.objects.update({ top: distance.top + 5 });
                  setDistance({ ...distance, top: distance.top + 5 });
                }}
                kind={KIND.tertiary}
                size={SIZE.mini}
              >
                <Image
                  alt=""
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
                size={SIZE.mini}
                onClick={() => {
                  // @ts-ignore
                  editor.objects.update({ top: distance.top - 5 });
                  setDistance({ ...distance, top: distance.top - 5 });
                }}
              >
                <img
                  src="../../../../../../assets/movetop.png"
                  style={{ width: "17px", height: "auto" }}
                />
              </Button>
            </Block>
          )}
          returnFocus
          autoFocus
        >
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Di chuyển
          </Button>
        </StatefulPopover>
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Block $style={{ fontSize: "14px" }}>Kích thước</Block>
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
                    value={sliderValue}
                  />
                </Block>
              </Block>

              <Block>
                <SliderBox
                  aria-label="Volume"
                  defaultValue={1}
                  getAriaValueText={valuetext}
                  step={0.01}
                  marks
                  min={0}
                  max={10}
                  onChangeCommitted={handleSliderChanged}
                  valueLabelDisplay="auto"
                />
              </Block>
            </Block>
          )}
        >
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Chỉnh kích thước
          </Button>
        </StatefulPopover>
        <StatefulPopover
          placement={PLACEMENT.bottomLeft}
          content={() => (
            <Block width={"200px"} backgroundColor={"#ffffff"} padding={"20px"}>
              <Block
                $style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Block $style={{ fontSize: "14px" }}>Xoay góc</Block>
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
                    value={sliderValued}
                  />
                </Block>
              </Block>

              <Block>
                <SliderBox
                  aria-label="Volume"
                  defaultValue={1}
                  // getAriaValueText={valuetext}
                  step={1}
                  marks
                  min={0}
                  max={360}
                  onChangeCommitted={handleSliderChanged}
                  valueLabelDisplay="auto"
                  // value={}
                />
              </Block>
            </Block>
          )}
        >
          <Button kind={KIND.tertiary} size={SIZE.compact}>
            Xoay góc
          </Button>
        </StatefulPopover>
      </Block>
    </StatefulPopover>
  );
}

function TransitionElement() {
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
          gridGap={"8px"}
        >
          <Button
            // isSelected={state.align === TEXT_ALIGNS[0]}
            // onClick={() => {
            //   // @ts-ignore
            //   editor.objects.update({ textAlign: TEXT_ALIGNS[0] });
            //   setState({ align: TEXT_ALIGNS[0] });
            // }}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
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
            size={SIZE.mini}
          >
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
            size={SIZE.mini}
          >
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
            size={SIZE.mini}
          >
            <img
              src="../../../../../../assets/movetop.png"
              style={{ width: "17px", height: "auto" }}
            />
          </Button>
        </Block>
      )}
      returnFocus
      autoFocus
    >
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
        >
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
