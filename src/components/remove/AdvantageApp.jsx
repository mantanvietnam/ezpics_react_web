import React from "react";

const AdvantageApp = () => {
  return (
    <div className="bg-[rgb(248,250,253)] py-[3%] px-[5%]">
      <h1 className="text-5xl font-semibold my-10">
        Xóa nền ảnh với chất lượng cao
      </h1>
      <h1 className="text-5xl font-semibold my-10">
        với{" "}
        <span className="text-[80px] bg-gradient-to-r from-[rgb(13,255,255)] via-[rgb(0,81,239)] to-[rgb(164,0,191)] bg-clip-text text-transparent">
          Công nghệ AI
        </span>
      </h1>
      <div>
        <div className="flex pt-[5%]">
          <div className="pr-[10%]">
            <h1 className="text-3xl font-semibold my-10">
              Xóa nền, tách nền hình ảnh của bạn
            </h1>
            <p className="text-[17px] tracking-wide">
              Bạn có thể dùng nó để phục vụ cho nhu cầu cá nhân: Tạo ảnh thẻ,
              chụp ảnh thời trang, chụp ảnh quảng cáo... Ezpics sẽ giúp bạn có
              một bức ảnh hoàn hảo với chức năng xóa phông nền trực tuyến.
            </p>
          </div>
          <img
            src="/images/remove/remove_bg_feature_1.png"
            alt="bg-feature1"
            className="max-w-[50%] rounded-[10px]"
          />
        </div>
        <div className="flex pt-[5%]">
          <img
            src="/images/remove/background-remover1.gif"
            alt="bg-feature1"
            className="max-w-[50%] rounded-[10px]"
          />
          <div className="pl-[10%]">
            <h1 className="text-3xl font-semibold my-10">
              Ảnh chân thực, phong cách hóa
            </h1>
            <p className="text-[17px] tracking-wide">
              Tiết kiệm thời gian, công sức và tiền bạc của bạn và chỉnh sửa ảnh
              ngay lập tức! Ezpics sẵn sàng để bạn hiện thực hóa ý tưởng, giải
              phóng trí tưởng tượng và khai phá tiềm năng kinh doanh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantageApp;
