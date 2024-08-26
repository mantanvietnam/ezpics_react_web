"use client";
import React, { useState } from "react";
import Image from "next/image";
import { contactInfo } from "../../../../public/images/index2";
import { checkTokenCookie } from "@/utils/cookie";
import { saveContactAPI } from "@/api/contact";
import { toast, ToastContainer } from "react-toastify";

const contactItems = [
  {
    icon: contactInfo.man,
    title: "Họ và tên",
    content: "Mr. Chinh",
  },
  {
    icon: contactInfo.phone,
    title: "Số điện thoại",
    content: "0917026300",
  },
  {
    icon: contactInfo.gmail,
    title: "Email",
    content: "ezpicsvn@gmail.com",
  },
];

function ContactDetail({ icon, title, content }) {
  return (
    <div className="flex items-center">
      <Image src={icon} alt={title} className="w-10 h-10 mr-6 rounded-full" />
      <div className="flex flex-col">
        <p className="font-normal text-base text-white py-2">{title}:</p>
        <p className="font-bold text-lg text-white">{content}</p>
      </div>
    </div>
  );
}

function Ordered() {
  const [contactText, setContactText] = useState("");

  const handleInputChange = (e) => {
    setContactText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveContactAPI({
        token: checkTokenCookie(),
        content: contactText,
      });
      toast.success("Gửi thông tin liên hệ thành công", {
        autoClose: 500,
      });
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="h-full w-full px-8 py-4 flex flex-col md:flex-row">
      <div
        className="relative w-full md:w-1/2 bg-gray-100 rounded-l-lg shadow-md p-6 flex flex-col items-center"
        style={{ backgroundImage: "url(./images/bg-designer.png)" }}>
        <div>
          <div className="absolute inset-0 backdrop-filter backdrop-blur-sm rounded-l-lg bg-black bg-opacity-50"></div>
          <div className="info relative z-10">
            <h1 className="text-3xl font-bold text-white">
              Liên hệ với chúng tôi
            </h1>
            <div className="contact-details flex flex-col gap-4 mt-6">
              {contactItems.map((item, index) => (
                <ContactDetail
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                />
              ))}
            </div>
          </div>
        </div>
        <button className="button-red mb-6 mt-20 relative z-10">
          Hỗ trợ trực tuyến
        </button>
      </div>

      <div className="flex flex-col w-full md:w-1/2  items-center justify-between bg-white rounded-r-lg shadow-md border-2 border-slate-300 p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Gửi nội dung liên hệ
          </h1>
          <textarea
            className="w-full mt-6 p-4 rounded-md border border-gray-300 focus:outline-none focus:border-gray-300 resize-none"
            placeholder="Nhập nội dung liên hệ"
            value={contactText}
            onChange={handleInputChange}
            rows="10"
          />
          <button type="submit" className="button-red w-2/5 mb-6 mt-10">
            Gửi liên hệ
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Ordered;
