import React from "react";

const HeaderRemove = () => {
  return (
    <div className="header animate-slideInFromLeft z-1 bg-custom-remove bg-left bg-no-repeat bg-contain pt-[5%] pl-[5%] flex justify-between">
      <div className="header-text">
        <h1 className="text-5xl text-slate-800 font-bold mb-10">
          Xóa hình ảnh
        </h1>
        <h1 className="text-5xl text-slate-800 font-bold my-10">
          Nền tiện lợi và nhanh
        </h1>
        <h1 className="text-5xl text-slate-800 font-bold my-10">chóng</h1>
        <p className="my-5">
          Remover nền trực tuyến dễ dàng nhất từ ​​trước đến nay
        </p>
        <button className="mt-5 w-[250px] h-[60px] self-center normal-case text-white bg-[rgb(81,100,255)] rounded-[30px] text-[20px] font-semibold hover:shadow-lg">
          Dùng thử ngay
        </button>
        <img
          src="/images/remove/bg-banner.png"
          alt="bg-banner"
          className="max-w-full "
        />
      </div>
      <video
        autoPlay
        muted
        loop
        className="w-[720px] h-[540px] mt-[5%] rounded-[20px]">
        <source src="/images/remove/en1.6b3b0bc4.mp4" />
      </video>
    </div>
  );
};

export default HeaderRemove;
