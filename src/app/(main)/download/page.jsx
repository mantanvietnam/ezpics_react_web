import React from "react";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";

const page = () => {
  return (
    <div className="w-full">
      <div className="min-w-full pt-[5%] flex flex-col justify-center items-center flex-grow">
        <h1 className="text-5xl font-bold mb-6">
          Ezpics đã có mặt trên mọi nền tảng
        </h1>
        <p className="text-slate-500 mb-5">
          Quét mã QR để cài đặt ứng dụng Ezpics trên iPhone hoặc iPad của bạn.
        </p>
        <div className="flex items-center mb-5">
          <a href="https://apps.apple.com/vn/app/ezpics-d%C3%B9ng-l%C3%A0-th%C3%ADch/id1659195883?l=vi?l=vi">
            <img src="/images/remove/ios.png" alt="ios" className="w-44 h-12" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=vn.ezpics&hl=vi&gl=US">
            <img
              src="/images/remove/ggplay.png"
              alt="ggplay"
              className="w-44 h-[72px]"
            />
          </a>
        </div>
        <p>
          Cũng có trên{" "}
          <a href="https://ezpics.vn" className="text-sky-500 underline">
            Web
          </a>
        </p>
        <div className="flex flex-row justify-center items-center pb-[10%]">
          <img
            src="/images/banner/banner1.jpg"
            alt=""
            className="rounded-[20px] w-[220px] h-[260px] mt-[5%] mr-[4%]"
          />
          <img
            src="/images/banner/banner5.jpg"
            alt=""
            className="rounded-[20px] max-h-[260px] mr-[4%]"
          />
          <img
            src="/images/banner/banner3.jpg"
            alt=""
            className="rounded-[20px] w-[200px] h-[220px] mt-[15%] mr-[4%]"
          />
          <img
            src="/images/banner/banner4.jpg"
            alt=""
            className="rounded-[20px] w-[200px] h-[200px] mr-[4%]"
          />
        </div>
      </div>
      <div className="w-full h-30 border-t border-[rgb(225,228,231)] flex justify-between items-center py-[3%] px-[5%] mt-10">
        <button className="border border-[rgb(225,228,231)] bg-white flex w-[220px] items-center justify-between px-3">
          <GlobalOutlined className="text-xl" />
          <p className="pr-[2%] pl-[2%] my-3 text-[rgb(13,18,22)] text-sm">
            Tiếng Việt (Việt Nam)
          </p>
          <DownOutlined />
        </button>
        <p>© 2024 Mọi quyền được bảo lưu, Ezpics®</p>
        <a href="https://www.facebook.com/ezpicsvn">
          <img src="/images/fb_logo.png" alt="" className="w-[20px] h-[20px]" />
        </a>
      </div>
    </div>
  );
};

export default page;
