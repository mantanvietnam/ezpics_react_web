/* eslint-disable @next/next/no-img-element */
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
    </div>
  );
};

export default page;
