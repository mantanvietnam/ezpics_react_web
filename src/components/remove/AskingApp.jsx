/* eslint-disable @next/next/no-img-element */
import React from "react";

const AskingApp = () => {
  return (
    <div className="bg-custom-remove md:bg-left bg-cover pt-[8%] pb-[4%] px-[5%] md:flex justify-between">
      <div className="pb-[4%]">
        <h1 className="text-4xl font-bold">Sẵn sàng để xóa nền hình ảnh?</h1>
        <button className="bg-[rgb(67,167,255)] border-none w-[200px] h-[50px] text-[18px] text-white font-semibold rounded-[30px] mt-[4%] md:mt-[10%]">
          Bắt đầu bây giờ
        </button>
      </div>
      <img src="/images/remove/bg-asking.png" alt="" />
    </div>
  );
};

export default AskingApp;
