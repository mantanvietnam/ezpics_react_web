import React, { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { Button, Slider, Popover, Modal } from "antd";
import { useClickAway } from "react-use";
import PanelsCommon from "./PanelsCommon";
import { flipLayerHorizontally } from "@/redux/slices/editor/stageSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkTokenCookie } from "@/utils";
import { updateLayer } from "@/redux/slices/editor/stageSlice";
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

const SliderMenu = ({
  valueSaturate,
  valueBrightness,
  valueContrast,
  valueOpacity,
  onChangeBrightness,
  onChangeOpacity,
  onChangeContrast,
  onChangeSaturate,
}) => (
  <div className="w-[250px]">
    <div className="p-2">
      <span>Độ sáng</span>
      <Slider onChange={onChangeBrightness} value={valueBrightness} />
    </div>
    <div className="p-2">
      <span>Độ trong</span>
      <Slider onChange={onChangeOpacity} value={valueOpacity} />
    </div>
    <div className="p-2">
      <span>Độ tương phản</span>
      <Slider onChange={onChangeContrast} value={valueContrast} />
    </div>
    <div className="p-2">
      <span>Độ bão hòa</span>
      <Slider onChange={onChangeSaturate} value={valueSaturate} />
    </div>
  </div>
);

const ButtonMenu = ({ onButtonChangeImageNew, onButtonChangeImage }) => (
  <div className="flex">
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={() => onButtonChangeImageNew()}>
      Thay ảnh từ máy
    </Button>
    <Button
      type="text"
      className="text-lg font-bold"
      onClick={() => onButtonChangeImage()}>
      Thay ảnh có sẵn
    </Button>
  </div>
);

export function PanelsImage({ selectedId, maxPositions }) {
  const layerActive = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();
  const selectedLayer = layerActive.selectedLayer;

  const [valueBrightness, setValueBrightness] = useState(50);
  const [valueOpacity, setValueOpacity] = useState(
    selectedLayer?.content.opacity * 100 || 100
  );
  const [valueContrast, setValueContrast] = useState(
    (selectedLayer?.content.contrast + 100) / 2 || 50
  );
  const [valueSaturate, setValueSaturate] = useState(0);

  useEffect(() => {
    if (selectedLayer) {
      setValueOpacity(selectedLayer.content.opacity * 100);
      setValueContrast(selectedLayer.content.contrast / 2);
      setValueBrightness(selectedLayer.content.brightness / 2);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (selectedLayer) {
      const data = {
        opacity: valueOpacity / 100,
        contrast: (valueContrast - 50) * 2, // Transform 0 to 100 to -100 to 100
        brightness: valueBrightness * 2,
      };

      dispatch(updateLayer({ id: selectedLayer.id, data: data }));
    }
  }, [selectedLayer?.id, valueOpacity, valueContrast, valueBrightness]);

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
    console.log("Button 1 clicked");
    setVisibleChangeImage(false);
    openModalChangeImageNew();
  };

  const handleButtonChangeImage = () => {
    console.log("Button 2 clicked");
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

  useEffect(() => {
    const data = {
      opacity: valueOpacity / 100,
      brightness: valueBrightness * 2,
    };
    dispatch(updateLayer({ id: selectedLayer.id, data: data }));
  }, [valueOpacity, selectedLayer.id, valueBrightness]);

  //Btn click lat anh
  const onFlipHorizontally = () => {
    if (selectedLayer) {
      dispatch(flipLayerHorizontally({ id: selectedId }));
    }
  };
  return (
    <div className="stick border-l border-slate-300 h-[50px] bg-white">
      <div className="h-[100%] flex items-center justify-between">
        <div className="flex items-center">
          <div className="px-1">
            <Button
              type="text"
              className="text-lg font-bold"
              onClick={() => onFlipHorizontally()}>
              Lật ảnh ngang
            </Button>
          </div>
          <div className="px-1">
            <Button type="text" className="text-lg font-bold">
              Lật ảnh dọc
            </Button>
          </div>
          <div className="px-1">
            <Button type="text" className="text-lg font-bold gap-0">
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
              onOpenChange={setVisibleEditImage}>
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonEditImage}>
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
              placement="bottomLeft">
              <Button
                type="text"
                className="text-lg font-bold"
                onClick={handleButtonImage}>
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
              onClick={() => openModalCrop()}>
              Cắt ảnh
            </Button>

            <ModalImageCrop
              isOpen={isModalCropOpen}
              onCancel={closeModalCrop}
            />
          </div>
        </div>

        <div>
          <PanelsCommon maxPositions={maxPositions} />
        </div>
      </div>
    </div>
  );
}

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

export function ModalImageCrop({ isOpen, onCancel }) {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);

  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef(null);

  const [layerObjects, setLayerObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stageData && stageData.selectedLayer) {
      const srcAttributeValue = stageData.selectedLayer.content.banner;
      setImgSrc(srcAttributeValue);
    }
  }, [stageData]);

  useEffect(() => {
    if (stageData && stageData.designLayers) {
      setLayerObjects(stageData.designLayers);
      console.log(stageData.designLayers);
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
        const data = {
          ...stageData.selectedLayer.content,
          banner: response.data?.link,
        };
        console.log(data);
        dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
        onCancel();
        setLoading(false);
        toast.success("Cắt ảnh thành công");
      }
    };
  };

  return (
    <>
      <Modal
        title="Cắt ảnh"
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        width={600}>
        <div className="">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(_)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            // minWidth={400}
            minHeight={50}
            // circularCrop
          >
            <img alt="Crop me" src={imgSrc} ref={imgRef} onLoad={onImageLoad} />
          </ReactCrop>
        </div>
        {loading ? (
          <Button className="text-lg" type="primary" loading>
            Loading
          </Button>
        ) : (
          <Button className="text-lg" onClick={() => cropCompleteImage()}>
            Cắt ảnh
          </Button>
        )}
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
    const imageBlob = dataURLToBlob(imgSrc);
    const token = checkTokenCookie();
    const formData = new FormData();

    if (token) {
      formData.append("idproduct", stageData.design.id);
      formData.append("token", token);
      formData.append("idlayer", stageData.selectedLayer.id);
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
      const data = {
        ...stageData.selectedLayer.content,
        banner: response.data?.link,
      };
      console.log(data);
      dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
      setLoading(false);
      handleCancel();
      toast.success("Thay ảnh thành công");
    }
  }

  return (
    <>
      <Modal
        title="Tải ảnh lên từ máy"
        open={isOpen}
        onCancel={() => handleCancel()}
        footer={null}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onSelectFile}
        />
        <div>
          {!!imgSrc && <img alt="Change image" src={imgSrc} className="mt-2" />}
        </div>

        {loading ? (
          <Button className="text-lg mt-2" type="primary" loading>
            Loading
          </Button>
        ) : (
          <Button className="text-lg mt-2" onClick={() => onChangeImageNew()}>
            Thay ảnh
          </Button>
        )}
      </Modal>
    </>
  );
}

export function ModalChangeImage({ isOpen, onCancel }) {
  const [photos, setPhotos] = useState([]);

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
    console.log(item);
    const token = checkTokenCookie();
    const formData = new FormData();

    if (token) {
      formData.append("idproduct", stageData.design.id);
      formData.append("token", token);
      formData.append("idlayer", stageData.selectedLayer.id);
      formData.append("idfile", item.id);
      formData.append("width", 1000);
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
      "https://apis.ezpics.vn/apis/changeLayerImageApi",
      formData,
      config
    );
    console.log(response);

    if (response && response?.data?.code === 1) {
      const data = {
        ...stageData.selectedLayer.content,
        banner: response.data?.link,
      };
      console.log(data);
      dispatch(updateLayer({ id: stageData.selectedLayer.id, data: data }));
      onCancel();
      toast.success("Thay ảnh thành công");
    }
  };

  return (
    <>
      <Modal
        title="Ảnh đã tải lên"
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        width={1000}>
        <div className="px-4 overflow-y-auto">
          <div className="grid gap-4 grid-cols-4">
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
        </div>
      </Modal>
    </>
  );
}

function ImageItem({ preview, onClick, onContextMenu, item }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="relative bg-[#f8f8fb] cursor-pointer rounded-lg overflow-hidden group">
      <div className="absolute inset-0 h-full w-full"></div>
      <img
        src={preview}
        alt=""
        className="w-full h-full object-contain pointer-events-none align-middle"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
    </div>
  );
}
