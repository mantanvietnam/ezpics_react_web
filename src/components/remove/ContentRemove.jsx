import React from "react";

const ContentRemove = () => {
  return (
    <div className="content-remove pt-[7%] px-[5%]">
      <h1 className="text-center text-4xl font-semibold">
        Làm cách nào để sử dụng công cụ tách nền online bằng AI trên Ezpics RB?
      </h1>
      <p className="text-center py-[5%] px-[10%]">
        Ezpics RB - <b className="font-bold">Xóa nền trực tuyến</b> là công cụ
        hỗ trợ AI cho phép người dùng dễ dàng xóa phông của hình ảnh trực tuyến.
        Tạo nền trong suốt, loại bỏ nền cho bất kỳ hình ảnh nào. Dưới đây là
        hướng dẫn từng bước về cách sử dụng công cụ của chúng tôi. Truy cập
        trang web Ezpics. Nhấp vào{" "}
        <span className="text-[rgb(81,100,255)] cursor-pointer font-semibold">
          Remove Background
        </span>{" "}
        trên tiêu đề và...
      </p>
      <div className="list-step-remove flex justify-between">
        <div>
          <img
            src="/images/remove/remove_bg_step_1.png"
            alt="remove_bg_step_1"
          />
          <div className="flex items-center pt-6">
            <div className="w-[30px] h-[30px] rounded-[25px] flex items-center justify-center bg-[rgb(215,229,254)] text-[rgb(0,81,238)] text-[14px] font-semibold">
              1
            </div>
            <p className="ml-2.5 font-semibold text-[14px]">Tải ảnh lên</p>
          </div>
          <p className="my-6">
            Tải lên hoặc Kéo và thả hình ảnh vào khung "Tải ảnh lên" để bắt đầu{" "}
            <b className="font-bold">chỉnh sửa với Ezpics RB</b>
          </p>
        </div>
        <div className="px-[5%]">
          <img
            src="/images/remove/remove_bg_step_2.png"
            alt="remove_bg_step_2"
          />
          <div className="flex items-center pt-6">
            <div className="w-[30px] h-[30px] rounded-[25px] flex items-center justify-center bg-[rgb(215,229,254)] text-[rgb(0,81,238)] text-[14px] font-semibold">
              2
            </div>
            <p className="ml-2.5 font-semibold text-[14px]">Xóa nền</p>
          </div>
          <p className="my-6">
            Đợi vài giây để công nghệ AI sẽ xóa nền tự động
          </p>
        </div>
        <div>
          <img
            src="/images/remove/remove_bg_step_3.png"
            alt="remove_bg_step_3"
          />
          <div className="flex items-center pt-6">
            <div className="w-[30px] h-[30px] rounded-[25px] flex items-center justify-center bg-[rgb(215,229,254)] text-[rgb(0,81,238)] text-[14px] font-semibold">
              3
            </div>
            <p className="ml-2.5 font-semibold text-[14px]">
              Tải xuống & chia sẻ
            </p>
          </div>
          <p className="my-6">
            Nhấp vào nút <b className="font-bold">Tải xuống</b> hoặc dùng trên{" "}
            <b className="font-bold">Editor Ezpics.</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentRemove;
