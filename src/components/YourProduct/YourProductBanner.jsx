"use client";
import Image from "next/image";
import React from "react";
import images from "../../../public/images/index2";

export default function YourProductBanner() {
  return (
    <div
      style={{
        background: "rgb(231, 246, 246)",
      }}
      className="flex justify-between gap-5 p-[20px] mobile:p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]">
      <div className="w-1/2">
        <div className="text-lg mobile:text-[32px] font-bold">
          Hãy thổi hồn vào các mẫu thiết kế của bạn
        </div>
        <div className="">
          Không chỉ là mẫu thiết kế, mà là một phần của cuộc sống hiện đại, thể
          hiện sự cá nhân hóa và gu thẩm mỹ của bạn.
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="relative w-[80%] h-[80%] mobile:w-full mobile:h-full">
          <Image
            src={images.painter}
            alt=""
            layout="fill"
            objectFit="contain"
            style={{ transform: "scale(1.5)" }}
          />
        </div>
      </div>
    </div>
  );
}
