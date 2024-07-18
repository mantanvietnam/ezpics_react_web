/* eslint-disable @next/next/no-img-element */
import React from "react";

const IntroduceApp = () => {
  return (
    <div className="py-[3%] px-[5%]">
      <div className="bg-[rgb(232,229,244)] h-full md:h-[200px] w-full rounded-[20px] px-[5%] py-[2%] flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-4xl font-bold my-6">
            Tải ứng dụng Ezpics về điện thoại !
          </h1>
          <p className="lg:pr-[10%]">
            Hãy thử tải ứng dụng Ezpics của chúng tôi để tận hưởng trải sửa ảnh
            trực tuyến tối ưu nhất
          </p>
        </div>
        <div className="flex items-center">
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
      </div>
    </div>
  );
};

export default IntroduceApp;
