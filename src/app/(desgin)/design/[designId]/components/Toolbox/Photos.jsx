/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { checkTokenCookie } from "@/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { addLayerImageUrlAPI } from "@/api/design";
import { useDispatch } from "react-redux";
import { addLayerImage } from "@/redux/slices/editor/stageSlice";
import { toast } from "react-toastify";

const Photos = ({ stageRef }) => {
  const [photos, setPhotos] = useState([]);
  const inputFileRef = React.useRef(null);

  const stageData = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();

  console.log("🚀 ~ Photos ~ stageRef:", stageRef);

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

  //B1: Call api tạo layer image
  //B2: Cập nhât redux để nó load lại state
  const handleAddPhoto = (item) => {
    console.log("🚀 ~ handleAddPhoto ~ item:", item);
    const addLayer = async () => {
      try {
        const res = await addLayerImageUrlAPI({
          idproduct: stageData.design.id,
          token: checkTokenCookie(),
          imageUrl: item.link,
          page: 0,
        });
        dispatch(addLayerImage(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    addLayer();
  };

  const handleDropFiles = async (files) => {
    const file = files[0];
    const url = URL.createObjectURL(file);
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");
      return;
    }

    const res = await axios.post(
      `https://apis.ezpics.vn/apis/addLayerImageAPI`,
      {
        idproduct: stageData.design.id,
        token: checkTokenCookie(),
        file: file,
        page: 0,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.code === 1) {
      toast.success("Thêm ảnh thành công");
      // console.log(res.data);
      // Cập nhật lại danh sách ảnh sau khi thêm thành công
      fetchData();
      dispatch(addLayerImage(res.data.data));
    }
  };

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileInput = (e) => {
    handleDropFiles(e.target.files);
  };

  return (
    <>
      <div
        className="absolute top-0 left-[100px] h-full w-[300px] overflow-y-scroll"
        style={{ scrollbarWidth: "thin" }}>
        <div className="px-4 py-4">
          <h4 className="py-2">Ảnh tải lên</h4>
          <button
            className="w-[100%] bg-black rounded-lg border border-transparent text-white px-4 py-2 hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
            onClick={handleInputFileRefClick}>
            Chọn ảnh từ máy
          </button>
          <input
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
        </div>
        <div className="px-4">
          <h4>Ảnh đã tải lên</h4>
          <div className="grid gap-2 grid-cols-2">
            {photos?.map((item, index) => {
              return (
                <ImageItem
                  key={index}
                  preview={`${item.link}`}
                  item={item}
                  onClick={() => {
                    handleAddPhoto(item);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

function ImageItem({ preview, onClick, onContextMenu, item }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="relative bg-[#f8f8fb] cursor-pointer rounded-lg overflow-hidden hover:before:opacity-100">
      <div className="absolute inset-0 h-full w-full"></div>
      <img
        src={preview}
        alt=""
        className="w-full h-full object-contain pointer-events-none align-middle"
      />
    </div>
  );
}

export default Photos;
