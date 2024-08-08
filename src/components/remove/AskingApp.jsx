/* eslint-disable @next/next/no-img-element */
import React from "react";

const AskingApp = () => {
  return (
    <div className="bg-custom-remove md:bg-left bg-cover pt-[8%] pb-[4%] px-[5%] md:flex justify-between">
      <div className="pb-[4%] flex justify-between items-center">
        <h1 className="text-5xl font-bold">Sẵn sàng để xóa nền hình ảnh?</h1>
      </div>
      <img src="/images/remove/bg-asking.png" alt="" />
    </div>
  );
};

export default AskingApp;
