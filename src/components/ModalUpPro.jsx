import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import Image from "next/image";
import classes from "@/styles/home/nav.module.scss";
import images, { proImages } from "../../public/images/index2";
import {
  memberExtendProMonthAPI,
  memberExtendProAPI,
  memberBuyProMonthAPI,
  memberBuyProAPI,
} from "@/api/transaction";
import { checkTokenCookie } from "@/utils/cookie";
import { toast } from "react-toastify";

const ModalUpPro = ({ open, handleCancel, isProMember }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [formData, setFormData] = useState({
    subscriptionOption: "",
    paymentOption: "",
  });
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  useEffect(() => {
    let interval;
    if (open) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % proImages.length);
      }, 6000);
    } else {
      setShowContent(true);
    }
    return () => clearInterval(interval);
  }, [open]);

  const handleButtonClick = async () => {
    console.log("Selected Subscription Option:", formData.subscriptionOption);
    console.log("Selected Payment Option:", formData.paymentOption);

    // Xử lý logic thanh toán ở đây
    let apiCall;
    const token = checkTokenCookie();

    if (isProMember) {
      if (formData.subscriptionOption == 1) {
        apiCall = memberExtendProMonthAPI;
      } else if (formData.subscriptionOption == 2) {
        apiCall = memberExtendProAPI;
      }
    } else {
      if (formData.subscriptionOption == 1) {
        apiCall = memberBuyProMonthAPI;
      } else if (formData.subscriptionOption == 2) {
        apiCall = memberBuyProAPI;
      }
    }

    // Determine the type based on paymentOption
    let type = formData.paymentOption === "ecoin" ? "ecoin" : "";

    // Make the API call if apiCall is defined
    if (apiCall) {
      try {
        const response = await apiCall({
          token: token,
          type: type,
          discountCode: "",
        });
        toast.info(response.mess);
        // Additional success handling logic here
      } catch (error) {
        console.error("API call failed:", error);
        // Additional error handling logic here
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormValid = formData.subscriptionOption && formData.paymentOption;

  const showDiscountModalHandler = () => setShowDiscountModal(true);

  const hideModal = () => setShowDiscountModal(false);

  return (
    <Modal open={open} onCancel={handleCancel} width={1000} footer={null}>
      <div className="flex h-fit">
        <div>
          {proImages.map((image, index) => (
            <div
              key={index}
              className={
                index === currentIndex ? classes.imageActive : classes.image
              }
            >
              <Image
                className="object-contain rounded-lg"
                alt="Image"
                src={image}
              />
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col justify-between items-center pl-2">
          {showContent ? (
            <>
              <div className="content">
                <h2 className="text-3xl font-semibold pb-2">
                  {isProMember ? "Gia hạn Ezpics Pro" : "Dùng thử Ezpics Pro"}
                </h2>
                <p className="text-sm py-4">
                  Năng suất hơn. Mạnh mẽ hơn. Dùng thử những tính năng ưu việt
                  của chúng tôi.
                </p>
                <p className="text-sm font-semibold">
                  Mở khóa các tính năng sau với Ezpics Pro.
                </p>
                <div className="decs pl-2">
                  <div className="flex items-center">
                    <Image
                      src={images.picture}
                      alt=""
                      className={classes.icon}
                    />
                    <p className="text-sm py-4 pl-2">
                      <strong className="font-semibold">
                        Hơn 100 triệu ảnh, video
                      </strong>{" "}
                      và thành phần cao cấp,{" "}
                      <strong className="font-semibold">
                        hơn 3.000 phông chữ cao cấp, hơn 610.000 mẫu cao cấp
                      </strong>
                    </p>
                  </div>
                  <div className="flex">
                    <Image
                      src={images.collection}
                      alt=""
                      width={20}
                      height={20}
                      className={classes.icon}
                    />
                    <p className="pl-2">
                      Sáng tạo dễ dàng nhờ các tính năng như{" "}
                      <strong className="font-semibold">
                        Xóa nền, tạo ảnh tự động
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="bg-red-600 text-white rounded px-5 py-2 ml-4 h-fit w-96 font-semibold"
                onClick={() => setShowContent(false)}
              >
                {isProMember ? "Gia hạn Ezpics Pro" : "Dùng thử Ezpics Pro"}
              </button>
            </>
          ) : (
            <>
              <div className="content">
                <h2 className="text-3xl font-semibold pb-2">
                  {isProMember ? "Gia hạn Ezpics Pro" : "Dùng thử Ezpics Pro"}
                </h2>
                <div className="flex flex-col items-start pl-0">
                  <form className="pl-0 flex flex-col justify-start">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="subscriptionOption"
                        value="1"
                        onChange={handleChange}
                      />
                      <span className="ml-1">Bản 1 tháng</span>
                    </label>
                    <p className="ml-8 mt-2 text-xs font-normal pb-1">
                      200.000 ₫ <b>hoặc</b> 200 eCoin
                    </p>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="subscriptionOption"
                        value="2"
                        onChange={handleChange}
                      />
                      <span className="ml-1">
                        Bản 12 tháng{" "}
                        <b className="text-red-500 text-base font-normal">
                          (Khuyến nghị)
                        </b>
                      </span>
                    </label>
                    <p className="ml-8 mt-2 text-xs font-normal pb-1">
                      1.999.000 ₫ <b>hoặc</b> 2000 eCoin
                    </p>
                  </form>

                  {[
                    " Chức năng xóa nền tự động",
                    " Hỗ trợ khách hàng 24/7",
                    " Viết content tự động",
                    " Nhận hoa hồng khi giới thiệu người dùng vĩnh viễn",
                  ].map((text, index) => (
                    <div key={index} className="flex pt-2 items-center">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="rgb(12, 134, 21)"
                            d="M4.53 11.9 9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"
                          ></path>
                        </svg>
                      </span>
                      <p className="m-0 text-base font-normal">{text}</p>
                    </div>
                  ))}

                  <p className="mt-2 ml-1 text-sm font-medium text-red-500 mb-0">
                    Tặng 1 bộ sưu tập 500 mẫu Ezpics
                  </p>
                  <form className="pt-4 flex flex-row justify-start">
                    <label className="mr-2 flex items-center">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="cash"
                        onChange={handleChange}
                      />
                      <span className="ml-1">Mua bằng tiền mặt</span>
                    </label>
                    <label className="mr-2 flex items-center">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="ecoin"
                        onChange={handleChange}
                      />
                      <span className="ml-1">Mua bằng eCoin</span>
                    </label>
                  </form>
                </div>
              </div>

              <div>
                <div className="flex flex-row justify-between items-end pb-4">
                  <div className="flex flex-row items-end">
                    <Image src={images.discount} alt="" className="w-5 h-5" />
                    <p className="m-0 text-xs">Ezpics Voucher</p>
                  </div>
                  <p
                    className="text-xs m-0 text-red-600 cursor-pointer"
                    onClick={showDiscountModalHandler}
                  >
                    Chọn để nhập mã
                  </p>
                </div>

                <button
                  className={`bg-red-600 text-white rounded px-5 py-2 ml-4 h-fit w-96 font-semibold ${
                    isFormValid ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleButtonClick}
                  disabled={!isFormValid}
                >
                  Thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={showDiscountModal} onCancel={hideModal} footer={null}>
        <div>
          <h2 className="text-xl font-semibold mb-4">Chọn voucher</h2>
          <div className="flex flex-col items-center h-64">
            <p>Hiện tại chưa có mã giảm giá nào.</p>
          </div>
          <div className="flex justify-end">
            <button
              className={
                "boder-2 shadow-xl rounded px-5 py-2 ml-4 h-fit w-fit font-semibold"
              }
              onClick={hideModal}
            >
              Hủy
            </button>
            <button
              className={
                "bg-red-600 text-white rounded px-5 py-2 ml-4 h-fit w-fit font-semibold opacity-50 cursor-not-allowed"
              }
            >
              Chọn voucher
            </button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default ModalUpPro;
