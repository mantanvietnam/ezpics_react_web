import React, { useState, useRef, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { Button, Slider, Popover, Modal, Input } from "antd";
import { useClickAway } from "react-use";
import PanelsCommon from "./PanelsCommon";
import { useDispatch, useSelector } from "react-redux";
import { checkAvailableLogin, checkTokenCookie, getCookie } from "@/utils";
import { deselectLayer, updateLayer } from "@/redux/slices/editor/stageSlice";
import axios from "axios";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";

function dataURLToBlob(dataURL) {
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

const SliderMenu = ({
  valueBrightness,
  valueOpacity,
  valueContrast,
  valueSaturate,
  onChangeBrightness,
  onChangeOpacity,
  onChangeContrast,
  onChangeSaturate,
}) => (
  <div className="w-[300px]">
    <div className="flex items-center p-2">
      <span className="w-[80px]">Độ sáng</span>
      <Slider
        onChange={onChangeBrightness}
        value={valueBrightness}
        className="flex-grow"
        min={0}
        max={100}
      />
      <Input
        type="number"
        value={valueBrightness}
        onChange={(e) => onChangeBrightness(parseInt(e.target.value))}
        className="w-16 ml-2"
        min={0}
        max={100}
      />
    </div>
    <div className="flex items-center p-2">
      <span className="w-[80px]">Độ trong</span>
      <Slider
        onChange={onChangeOpacity}
        value={valueOpacity}
        className="flex-grow"
        min={0}
        max={100}
      />
      <Input
        type="number"
        value={valueOpacity}
        onChange={(e) => onChangeOpacity(parseInt(e.target.value))}
        className="w-16 ml-2"
        min={0}
        max={100}
      />
    </div>
    <div className="flex items-center p-2">
      <span className="w-[80px]">Độ tương phản</span>
      <Slider
        onChange={onChangeContrast}
        value={valueContrast}
        className="flex-grow"
        min={0}
        max={100}
      />
      <Input
        type="number"
        value={valueContrast}
        onChange={(e) => onChangeContrast(parseInt(e.target.value))}
        className="w-16 ml-2"
        min={0}
        max={100}
      />
    </div>
    <div className="flex items-center p-2">
      <span className="w-[80px]">Độ bão hòa</span>
      <Slider
        onChange={onChangeSaturate}
        value={valueSaturate}
        className="flex-grow"
        min={0}
        max={200}
      />
      <Input
        type="number"
        value={valueSaturate}
        onChange={(e) => onChangeSaturate(parseInt(e.target.value))}
        className="w-16 ml-2"
        min={0}
        max={200}
      />
    </div>
  </div>
);

const ButtonMenu = ({ onButtonChangeImageNew, onButtonChangeImage }) => (
  <div className="flex">
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={() => onButtonChangeImageNew()}
    >
      Thay ảnh từ máy
    </Button>
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={() => onButtonChangeImage()}
    >
      Thay ảnh có sẵn
    </Button>
  </div>
);

export function PanelsImage({
  selectedId,
  maxPositions,
  onDuplicateLayer,
  fetchData,
}) {
  const layerActive = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();
  const selectedLayer = layerActive.selectedLayer;
  let dataInforUser;
  const token = checkTokenCookie();
  const authentication = checkAvailableLogin();
  const stageData = useSelector((state) => state.stage.stageData);
  const [imgSrc, setImgSrc] = useState("");
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  useEffect(() => {
    if (selectedLayer) {
      console.log(selectedLayer);
      const srcAttributeValue = selectedLayer.content.banner;
      setImgSrc(srcAttributeValue);
    }
  }, [selectedLayer]);

  console.log(imgSrc);

  // States for sliders
  const [valueBrightness, setValueBrightness] = useState(
    selectedLayer?.content.brightness / 2 || 50
  );
  const [valueOpacity, setValueOpacity] = useState(
    selectedLayer?.content.opacity * 100 || 50
  );
  const [valueContrast, setValueContrast] = useState(
    selectedLayer?.content.contrast / 2 || 50
  );
  const [valueSaturate, setValueSaturate] = useState(
    selectedLayer?.content.saturate / 2 || 50
  );

  useEffect(() => {
    if (selectedLayer) {
      setValueOpacity(selectedLayer.content.opacity * 100);
      setValueContrast(selectedLayer.content.contrast / 2);
      setValueBrightness(selectedLayer.content.brightness / 2 || 50);
      setValueSaturate(selectedLayer.content.saturate / 2);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (selectedLayer) {
      const data = {
        opacity: valueOpacity / 100,
        contrast: valueContrast * 2,
        saturate: valueSaturate * 2,
        brightness: valueBrightness * 2,
      };

      dispatch(updateLayer({ id: selectedLayer.id, data: data }));
    }
  }, [
    selectedLayer.id,
    valueOpacity,
    valueBrightness,
    valueContrast,
    valueSaturate,
    selectedLayer,
    dispatch,
  ]);

  // States for popover visibility
  const [visibleEditImage, setVisibleEditImage] = useState(false);
  const [visibleChangeImage, setVisibleChangeImage] = useState(false);

  //State modal
  const [isModalCropOpen, setIsModalCropOpen] = useState(false);
  const [isModalChangeImageNewOpen, setIsModalChangeImageNewOpen] =
    useState(false);
  const [isModalChangeImageOpen, setIsModalChangeImageOpen] = useState(false);

  //Handle modal
  const openModalCrop = () => {
    setIsModalCropOpen(true);
  };
  const closeModalCrop = () => {
    setIsModalCropOpen(false);
  };

  //Modal thay anh tai len tu may
  const openModalChangeImageNew = () => {
    setIsModalChangeImageNewOpen(true);
  };
  const closeModalChangeImageNew = () => {
    setIsModalChangeImageNewOpen(false);
  };

  //Modal thay anh co san
  const openModalChangeImage = () => {
    setIsModalChangeImageOpen(true);
  };
  const closeModalChangeImage = () => {
    setIsModalChangeImageOpen(false);
  };

  // Refs for popovers
  const popoverRefEditImage = useRef(null);
  const popoverRefChangeImage = useRef(null);

  // Handlers for sliders
  const handleSliderBrightness = (newValue) => {
    setValueBrightness(newValue);
  };

  const handleSliderOpacity = (newValue) => {
    setValueOpacity(newValue);
  };

  const handleSliderContrast = (newValue) => {
    setValueContrast(newValue);
  };

  const handleSliderSaturate = (newValue) => {
    setValueSaturate(newValue);
  };

  // Handlers for popovers
  const handleButtonEditImage = () => {
    setVisibleEditImage(!visibleEditImage);
  };

  const handleButtonImage = () => {
    setVisibleChangeImage(!visibleChangeImage);
  };

  const handleButtonChangeImageNew = () => {
    setVisibleChangeImage(false);
    openModalChangeImageNew();
  };

  const handleButtonChangeImage = () => {
    setVisibleChangeImage(false);
    openModalChangeImage();
  };

  // Click away handlers
  useClickAway(popoverRefEditImage, () => {
    if (visibleEditImage) {
      setVisibleEditImage(false);
    }
  });

  useClickAway(popoverRefChangeImage, () => {
    if (visibleChangeImage) {
      setVisibleChangeImage(false);
    }
  });

  const HandleRemoveBackground = async () => {
    let proUser;

    if (!authentication) {
      toast.error(
        "Bạn chưa là pro. Hãy nâng cấp tài khoản để thực hiện chức năng này !!!"
      );
      return;
    } else if (dataInforUser.member_pro === 1) {
      proUser = true;
    }

    if (proUser) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "multipart/form-data",
      };
      const config = {
        headers: headers,
      };

      const formData = new FormData();
      let responseRemoveBackground;

      try {
        console.log(imgSrc);
        // Convert image URL to Blob
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        formData.append("image", file);
        formData.append("token", checkTokenCookie());

        // Thông báo cho người dùng là yêu cầu đã được gửi
        toast.info("Đang xử lý xóa nền ảnh...", {
          autoClose: false, // Không tự động đóng
        });

        // Gửi yêu cầu đến API xóa nền
        responseRemoveBackground = await axios.post(
          `https://apis.ezpics.vn/apis/removeBackgroundImageAPI`,
          formData,
          config
        );

        console.log(responseRemoveBackground.data);

        // Kiểm tra kết quả trả về từ API
        if (responseRemoveBackground.data.code === 0) {
          const data = {
            banner: responseRemoveBackground.data.linkOnline,
          };
          dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));

          // Thông báo thành công
          toast.success("Xóa nền ảnh thành công", {
            autoClose: 500,
          });
        } else {
          // Thông báo nếu API trả về lỗi
          toast.error("Không thể xóa nền ảnh, vui lòng thử lại!", {
            autoClose: 500,
          });
        }
      } catch (error) {
        console.error(error);
        // Thông báo lỗi khi có vấn đề trong quá trình gửi yêu cầu
        toast.error("Lỗi khi xóa nền ảnh, vui lòng thử lại!", {
          autoClose: 500,
        });
      } finally {
        // Đóng thông báo khi xử lý hoàn tất
        toast.dismiss(); // Tắt tất cả các thông báo
      }
    } else {
      toast.error(
        "Bạn chưa là tài khoản PRO nên không được truy cập, hãy nâng cấp để dùng nhé !",
        {
          position: "top-left",
          autoClose: 500,
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

  //lat anh
  const canvasRef = useRef(null);

  useEffect(() => {
    // Tạo canvas khi component mount
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
  }, []);

  const drawAndFlipImage = (
    imageSrc,
    flipHorizontally = false,
    flipVertically = false
  ) => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageSrc;

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Thiết lập ma trận biến đổi
        ctx.setTransform(
          flipHorizontally ? -1 : 1,
          0,
          0,
          flipVertically ? -1 : 1,
          flipHorizontally ? width : 0,
          flipVertically ? height : 0
        );

        // Vẽ hình ảnh lên canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Lấy dữ liệu hình ảnh từ canvas
        const dataUrl = canvas.toDataURL("image/png");

        resolve(dataUrl);
      };

      image.onerror = (err) => {
        console.error("Error loading image:", err);
        reject(err);
      };
    });
  };

  const updateLayerWithFlippedImage = async (
    imageSrc,
    flipHorizontally,
    flipVertically
  ) => {
    if (selectedLayer) {
      try {
        const flippedImageSrc = await drawAndFlipImage(
          imageSrc,
          flipHorizontally,
          flipVertically
        );
        const data = {
          ...selectedLayer.content,
          banner: flippedImageSrc,
        };
        await dispatch(updateLayer({ id: selectedId, data: data }));

        // Cập nhật lại imgSrc để phản ánh ảnh mới đã lật
        setImgSrc(flippedImageSrc);
      } catch (err) {
        console.error("Error flipping image:", err);
      }
    }
  };

  const onFlipHorizontally = () => {
    if (imgSrc) {
      updateLayerWithFlippedImage(imgSrc, true, false);
    }
  };
  const onFlipVertically = () => {
    if (imgSrc) {
      updateLayerWithFlippedImage(imgSrc, false, true);
    }
  };

  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <div className="flex items-center">
          <div className="px-1">
            <Button
              type="text"
              className="gap-0 text-lg font-bold"
              onClick={HandleRemoveBackground}
            >
              {" "}
              Xóa nền
              <NextImage
                src="/assets/premium.png"
                style={{
                  resize: "block",
                  marginBottom: "20%",
                  marginLeft: "3",
                }}
                width={15}
                height={15}
                alt=""
              />
            </Button>
          </div>

          <div className="px-1">
            <Button
              type="text"
              className="text-lg font-bold"
              onClick={() => onFlipHorizontally()}
            >
              Lật ảnh ngang
            </Button>
          </div>
          <div className="px-1">
            <Button
              type="text"
              className="text-lg font-bold"
              onClick={() => onFlipVertically()}
            >
              Lật ảnh dọc
            </Button>
          </div>

          <div className="px-1" ref={popoverRefEditImage}>
            <Popover
              content={
                <SliderMenu
                  onChangeBrightness={handleSliderBrightness}
                  onChangeOpacity={handleSliderOpacity}
                  onChangeContrast={handleSliderContrast}
                  onChangeSaturate={handleSliderSaturate}
                  valueBrightness={valueBrightness}
                  valueOpacity={valueOpacity}
                  valueContrast={valueContrast}
                  valueSaturate={valueSaturate}
                />
              }
              trigger="click"
              open={visibleEditImage}
              onOpenChange={setVisibleEditImage}
            >
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonEditImage}
              >
                Chỉnh sửa ảnh
              </Button>
            </Popover>
          </div>

          <div className="px-1">
            <Popover
              content={
                <ButtonMenu
                  onButtonChangeImage={handleButtonChangeImage}
                  onButtonChangeImageNew={handleButtonChangeImageNew}
                />
              }
              trigger="click"
              open={visibleChangeImage}
              onOpenChange={setVisibleChangeImage}
              placement="bottomLeft"
            >
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonImage}
              >
                Thay ảnh
              </Button>
            </Popover>

            <ModalChangeImageNew
              isOpen={isModalChangeImageNewOpen}
              onCancel={closeModalChangeImageNew}
            />

            <ModalChangeImage
              isOpen={isModalChangeImageOpen}
              onCancel={closeModalChangeImage}
            />
          </div>

          <div className="px-1">
            <Button
              type="text"
              className="text-lg font-bold"
              onClick={() => openModalCrop()}
            >
              Cắt ảnh
            </Button>

            <ModalImageCrop
              isOpen={isModalCropOpen}
              onCancel={closeModalCrop}
              fetchData={fetchData}
            />
          </div>
        </div>

        <div>
          <PanelsCommon
            maxPositions={maxPositions}
            onDuplicateLayer={onDuplicateLayer}
          />
        </div>
      </div>
    </div>
  );
}

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
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

export function ModalImageCrop({ isOpen, onCancel, fetchData }) {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);

  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef(null);
  const modalRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stageData && stageData.selectedLayer) {
      const srcAttributeValue = stageData.selectedLayer.content.banner;
      setImgSrc(srcAttributeValue);
    }
  }, [stageData]);

  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState(undefined);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(aspect, width, height));
    }
  }

  const cropCompleteImage = () => {
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

      const imageBlob = dataURLToBlob(dataUrl);
      const token = checkTokenCookie();
      const formData = new FormData();

      if (token) {
        formData.append("idproduct", stageData.design.id);
        formData.append("token", token);
        formData.append("idlayer", stageData.selectedLayer.id);
        formData.append("file", imageBlob, "cropped_image.png");
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

      if (response && response?.data?.code === 1) {
        const data = {
          banner: response.data?.link,
        };
        dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
        setTimeout(() => {
          fetchData();
        }, 0);
        onCancel();
        setLoading(false);
        toast.success("Cắt ảnh thành công", {
          autoClose: 500,
        });
      }
    };
  };

  // Function to handle clicks outside of the modal
  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel(); // Close the modal when clicking outside
      }
    },
    [onCancel]
  );

  // Attach and clean up event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <>
      <Modal
        title="Cắt ảnh"
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        width={600}
        styles={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f0f0f0",
        }}
        maskClosable={false}
      >
        <div
          ref={modalRef}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "10px",
            backgroundColor: "#ccc",
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(_)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minHeight={50}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <img
              alt="Crop me"
              src={imgSrc}
              ref={imgRef}
              onLoad={onImageLoad}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </ReactCrop>

          <div className="flex justify-center">
            {loading ? (
              <Button className="text-lg" type="primary" loading>
                Loading
              </Button>
            ) : (
              <button
                className="text-lg font-bold mt-2 bg-[#cbaa40] p-2 rounded-lg"
                onClick={cropCompleteImage}
              >
                Cắt ảnh
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export function ModalChangeImageNew({ isOpen, onCancel }) {
  const [imgSrc, setImgSrc] = useState("");
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleCancel = () => {
    onCancel();
    setImgSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function onChangeImageNew() {
    setLoading(true);
    if (imgSrc === "") {
      toast.error("Vui lòng chọn ảnh");
      setLoading(false);
      return;
    }
    const res = await fetch(imgSrc);
    const blob = await res.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    // const imageBlob = dataURLToBlob(imgSrc);
    const token = checkTokenCookie();
    const formData = new FormData();

    if (token) {
      formData.append("idproduct", stageData.design.id);
      formData.append("token", token);
      formData.append("idlayer", stageData.selectedLayer.id);
      formData.append("file", file);
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

    console.log(response.data);

    if (response && response?.data?.code === 1) {
      const data = {
        banner: response.data?.link,
      };
      console.log(data);
      dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
      dispatch(deselectLayer());
      setLoading(false);
      handleCancel();
      toast.success("Thay ảnh thành công", {
        autoClose: 500,
      });
    }
  }

  return (
    <>
      <Modal
        title="Tải ảnh lên từ máy"
        open={isOpen}
        onCancel={() => handleCancel()}
        footer={null}
      >
        <div>
          {imgSrc ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <img
                src={imgSrc}
                alt=""
                style={{
                  height: "auto",
                  alignSelf: "center",
                }}
              />
            </div>
          ) : (
            <div className="relative flex flex-col pt-4">
              <form
                id="file-upload-form"
                className="block clear-both w-full mx-auto max-w-600"
              >
                <input
                  className="hidden"
                  id="file-upload"
                  type="file"
                  name="fileUpload"
                  accept="image/*"
                  onChange={onSelectFile}
                />

                <label
                  className="float-left clear-both w-full px-6 py-8 text-center transition-all bg-white border rounded-lg select-none"
                  htmlFor="file-upload"
                  id="file-drag"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    id="file-image"
                    src="#"
                    alt="Preview"
                    className="hidden"
                  />
                  <div id="">
                    <img
                      src="/images/direct-download.png"
                      alt=""
                      style={{
                        width: 30,
                        height: 30,
                        alignSelf: "center",
                        margin: "0 auto",
                        marginBottom: "2%",
                      }}
                    />
                    <div id="notimage" className="hidden">
                      Hãy chọn ảnh
                    </div>
                    <span id="file-upload-btn" className="">
                      {imgSrc === "" && "Chọn ảnh"}
                    </span>
                  </div>
                  <div id="response" className="hidden">
                    <div id="messages"></div>
                    <progress className="progress" id="file-progress" value="0">
                      <span>0</span>%
                    </progress>
                  </div>
                </label>
              </form>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {loading ? (
            <Button className="p-2 mt-2 text-lg" type="primary" loading>
              Loading
            </Button>
          ) : (
            <button
              className="text-lg font-bold mt-2 bg-[#cbaa40] p-2 rounded-lg"
              onClick={() => onChangeImageNew()}
            >
              Thay ảnh
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}

export function ModalChangeImage({ isOpen, onCancel }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const stageData = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `https://apis.ezpics.vn/apis/listImage`,
        {
          token: checkTokenCookie(),
        }
      );
      setPhotos(response.data.data.reverse());
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu GET:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePhoto = async (item) => {
    setIsLoading(true); // Bật trạng thái loading khi gọi API

    const token = checkTokenCookie();
    const formData = new FormData();

    if (token) {
      formData.append("idproduct", stageData.design.id);
      formData.append("token", token);
      formData.append("idlayer", stageData.selectedLayer.id);
      formData.append("idfile", item.id);
      formData.append("width", 1000);
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
        "https://apis.ezpics.vn/apis/changeLayerImageApi",
        formData,
        { headers }
      );

      if (response && response?.data?.code === 1) {
        const data = {
          banner: response.data?.link,
        };
        dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
        dispatch(deselectLayer());
        onCancel();
        toast.success("Thay ảnh thành công", {
          autoClose: 500,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thay đổi ảnh:", error);
      toast.error("Lỗi khi thay đổi ảnh", {
        autoClose: 500,
      });
    } finally {
      setIsLoading(false); // Tắt trạng thái loading sau khi có phản hồi
    }
  };

  return (
    <Modal
      title="Ảnh đã tải lên"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <div className="px-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-4">
          {photos?.map((item, index) => {
            return (
              <ImageItem
                key={index}
                preview={`${item.link}`}
                item={item}
                onClick={() => {
                  handleChangePhoto(item);
                }}
              />
            );
          })}
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="absolute text-lg text-white top-10">
              Đang tải...
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function ImageItem({ preview, onClick, onContextMenu, item }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="relative bg-[#f8f8fb] cursor-pointer rounded-lg overflow-hidden group"
    >
      <div className="absolute inset-0 w-full h-full"></div>
      <img
        src={preview}
        alt=""
        className="object-contain w-full h-full align-middle pointer-events-none"
      />
      <div className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-50"></div>
    </div>
  );
}
