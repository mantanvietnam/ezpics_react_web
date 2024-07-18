/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { checkAvailableLogin, checkTokenCookie, getCookie } from "@/utils";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import ModalUpPro from "../ModalUpPro";

const HeaderRemove = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // New state for uploaded image URL
  const [modalExtend, setModalExtend] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);

  const [openPro, setOpenPro] = useState(false);
  const handleCancelPro = () => {
    setOpenPro(false);
  };

  const dispatch = useDispatch();
  const { data: session } = useSession();

  // Lấy data user
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  console.log(dataInforUser);

  const handleCloseModalFreeExtend = () => {
    setModalExtend(false);
    // Trigger a re-render by updating the reloadKey state
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleImageDownload = async () => {
    // Check if an image URL is available
    if (uploadedImageUrl) {
      try {
        // Fetch the image data
        const response = await fetch(uploadedImageUrl);
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_image.png"; // Set the desired filename

        // Append the anchor element to the body
        document.body.appendChild(a);

        // Trigger a click event on the anchor to start the download
        a.click();

        // Remove the anchor element from the body
        document.body.removeChild(a);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);

        // Optional: Close the modal if needed
        setModalExtend(false);
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    }
  };

  const handleRemoveBackground = () => {
    // Kiểm tra xem người dùng có đang đăng nhập hay không
    const authentication = checkAvailableLogin();
    // const authentication = true;

    // Nếu người dùng chưa đăng nhập (authentication là false)
    if (!authentication) {
      // In ra giá trị của authentication (sẽ là false)
      console.log(authentication);

      // Điều hướng người dùng đến trang đăng nhập
      router.push("/");
    } else {
      // Nếu người dùng đã đăng nhập, kích hoạt sự kiện click trên input file
      inputFileRef.current?.click();
    }
  };

  const handleFileInput = (e) => {
    handleDropFiles(e.target.files);
  };

  // Xây dựng Url cho api
  const network = useSelector((state) => state.network.ipv4Address);

  const handleDropFiles = async (files) => {
    // Đặt trạng thái đang tải lên là true
    setLoadingRemove(true);

    // Lấy tệp đầu tiên từ danh sách các tệp
    const file = files[0];

    // Tạo URL tạm thời cho tệp
    var url = URL.createObjectURL(file);

    // Kiểm tra định dạng tệp
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      // Hiển thị thông báo lỗi nếu định dạng không hợp lệ
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");

      // Đặt lại trạng thái đang tải lên là false
      setLoadingRemove(false);

      // Kết thúc hàm
      return;
    } else {
      // Định nghĩa các header cho yêu cầu
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "multipart/form-data",
      };

      // Cấu hình cho yêu cầu axios
      const config = {
        headers: headers,
      };

      // Tạo một đối tượng FormData để gửi dữ liệu tệp
      const formData = new FormData();

      // Thêm tệp vào FormData
      formData.append("image", file);

      // Thêm token vào FormData
      formData.append("token", checkTokenCookie());

      // Gửi yêu cầu POST để tải lên tệp và nhận phản hồi từ máy chủ
      try {
        const response = await axios.post(
          `${network}/removeBackgroundImageAPI`,
          formData,
          config
        );

        // Kiểm tra phản hồi từ máy chủ
        if (response && response.data) {
          // Đặt lại trạng thái đang tải lên là false
          setLoadingRemove(false);

          // Lưu URL của hình ảnh đã tải lên
          setUploadedImageUrl(response.data.linkOnline);

          // Mở rộng modal để hiển thị hình ảnh đã tải lên
          setModalExtend(true);
        } else {
          // Xử lý trường hợp phản hồi không có dữ liệu
          console.error("Response does not contain data");
          setLoadingRemove(false);
        }
      } catch (error) {
        // Xử lý lỗi khi gửi yêu cầu hoặc phản hồi từ máy chủ
        console.error(
          "An error occurred while removing background image:",
          error
        );
        setLoadingRemove(false);
      }
    }
  };

  const handleClickBtnBg = () => {
    // Kiểm tra xem người dùng có đang đăng nhập hay không
    const authentication = checkAvailableLogin();

    // Nếu người dùng chưa đăng nhập (authentication là false)
    if (!authentication) {
      // In ra giá trị của authentication (sẽ là false)
      console.log(authentication);

      // Điều hướng người dùng đến trang đăng nhập
      router.push("/sign-in");
    } else if (dataInforUser.member_pro === 1) {
      handleRemoveBackground();
    } else {
      setOpenPro(true);
    }
  };

  return (
    <div key={reloadKey}>
      <div className="header animate-slideInFromLeft z-1 bg-custom-remove xl:bg-left bg-no-repeat bg-contain pt-[5%] pl-[5%] xl:flex justify-between">
        <div className="header-text">
          <h1 className="text-3xl md:text-5xl text-slate-800 font-bold mb-4 md:mb-10">
            Xóa hình ảnh
          </h1>
          <h1 className="text-3xl md:text-5xl text-slate-800 font-bold mb-4 md:my-10">
            Nền tiện lợi và nhanh
          </h1>
          <h1 className="text-3xl md:text-5xl text-slate-800 font-bold mb4 md:my-10">
            chóng
          </h1>
          <p className="my-2 md:my-5">
            Remover nền trực tuyến dễ dàng nhất từ ​​trước đến nay
          </p>
          <button
            className="mt-2 md:mt-5 w-[250px] h-[60px] self-center normal-case text-white bg-[rgb(81,100,255)] rounded-[30px] text-[20px] font-semibold hover:shadow-lg active:bg-blue-600"
            onClick={() => handleClickBtnBg()}>
            {loadingRemove ? (
              <span>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 24,
                        color: "#fff",
                      }}
                      spin
                    />
                  }
                />
              </span>
            ) : (
              "Dùng thử ngay"
            )}
          </button>
          <input
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          <img
            src="/images/remove/bg-banner.png"
            alt="bg-banner"
            className="  md:max-w-full"
          />
        </div>
        <video
          autoPlay
          muted
          loop
          className="w-[432px] md:w-[720px] h-[324px] md:h-[540px] mt-[5%] rounded-[20px]">
          <source src="/images/remove/en1.6b3b0bc4.mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Modal
        title=" Chi tiết ảnh"
        open={modalExtend}
        onCancel={handleCloseModalFreeExtend}
        footer={null}
        width={"70%"}>
        <div className="flex flex-col items-center">
          <p className="m-0 text-base font-medium pt-[10px]">
            Bạn muốn dùng trong Editor Ezpics hay tải ảnh về ?
          </p>
          {uploadedImageUrl && (
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] object-cover rounded-lg mt-5"
            />
          )}
          <div>
            <button
              className="self-center normal-case text-black bg-white mt-10 mr-2 border-solid border-2 rounded-md p-2 shadow hover:shadow-lg"
              onClick={() => {
                handleCloseModalFreeExtend();
              }}>
              Không dùng
            </button>
            <button
              className="self-center normal-case text-white bg-[rgb(255,66,78)] mt-10 mr-2 rounded-md p-2 shadow hover:shadow-lg"
              onClick={() => {
                handleCloseModalFreeExtend();
              }}>
              Vào Editor
            </button>
            <button
              className="self-center normal-case text-white bg-[rgb(255,66,78)] mt-10 rounded-md p-2 shadow hover:shadow-lg"
              onClick={() => {
                handleImageDownload();
                handleCloseModalFreeExtend();
              }}>
              Tải ảnh về
            </button>
          </div>
        </div>
      </Modal>
      <ModalUpPro open={openPro} handleCancel={handleCancelPro} />
    </div>
  );
};

export default HeaderRemove;
