"use client";

import { GlobalOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import ModalUpPro from "@/components/ModalUpPro";
import FeatureList from "@/components/PricingCompare/FeatureList";

const Page = () => {
  const [selected, setSelected] = useState("monthly");
  const [open, setOpen] = useState(false);

  const handleButtonClick = (buttonType) => {
    setSelected(buttonType);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="w-full">
      <h1 className="min-h-[20%] flex justify-center text-5xl font-bold pt-[8%] bg-radial-gradient">
        Thiết kế
        <span
          className="px-2.5 text-transparent"
          style={{
            background: "linear-gradient(90deg, #229bd4, #7d2ae8)",
            backgroundClip: "text",
          }}>
          mọi thứ
        </span>
        với gói đăng ký phù hợp
      </h1>

      <div className="flex flex-row pt-[6%] px-[5%]">
        <div className="w-1/3">
          <h1 className="text-xl font-bold">Tính toán cho đội của bạn</h1>
        </div>
        <div className="w-1/3">
          <p className="text-base pb-2">Số lượng thành viên</p>
          <div className="w-[90%] h-[80%] flex items-center justify-around border-solid border border-slate-400 rounded-lg">
            <input
              type="text"
              placeholder="Tùy chỉnh"
              className="bg-white border-none text-base outline-none p-2"
            />
            <p>thành viên</p>
          </div>
        </div>
        <div className="w-1/3">
          <p className="text-base pb-2">
            <strong className="font-bold">Chu kì: </strong>
            <span style={{ color: "rgb(139, 61, 255);" }}>Tiết kiệm 16% </span>
            khi thanh toán theo năm
          </p>
          <div className="w-[90%] h-[80%] flex items-center border-solid border border-slate-400 rounded-lg px-2">
            <button
              className={`w-[90%] h-[80%] rounded-lg ${
                selected === "monthly" ? "bg-[rgb(255,66,78)] text-white" : ""
              }`}
              onClick={() => handleButtonClick("monthly")}>
              Hàng tháng
            </button>
            <button
              className={`w-[90%] h-[80%] rounded-lg ${
                selected === "yearly" ? "bg-[rgb(255,66,78)] text-white" : ""
              }`}
              onClick={() => handleButtonClick("yearly")}>
              Hàng năm
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row pt-[6%] px-[5%]">
        <div className="w-1/3">
          <div className="w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
            <div className="h-10 flex">
              <p className="bg-white w-[40%] flex items-center justify-center font-bold rounded-[10px] text-[11px] text-black my-2">
                Dành cho một người
              </p>
            </div>
            <p className="text-2xl font-bold my-8">Ezpics miễn phí</p>
            <p className="text-sm font-normal my-6">
              Tự tay thiết kế mọi thứ hoặc thiết kế cùng bạn bè và gia đình
            </p>
            <p className="text-[27px] font-bold my-4">
              0 <span className="underline">đ</span>
            </p>
            <p className="text-sm font-normal my-3">
              /năm dành cho một thành viên
            </p>
            <button className="flex justify-center items-center w-full bg-[#515558] border-0 pt-2.5 pb-2.5 mt-[15%] rounded-[5px] text-white">
              <Link href="/">Bắt đầu</Link>
            </button>
          </div>
          <FeatureList
            features={[
              "Trình biên tập kéo-thả dễ dùng",
              "Hơn 1 triệu mẫu được thiết kế chuyên nghiệp",
              "Hơn 1000 loại thiết kế (bài đăng mạng xã hội và hơn thế nữa)",
              "Hơn 3 triệu ảnh stock và đồ họa",
              "In và giao hàng thiết kế",
              "Đảm bảo tính nhất quán của thương hiệu với tính năng phê duyệt",
            ]}
            showContactInfo={false}
          />
        </div>
        <div className="w-1/3">
          <div className="w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
            <div className="flex justify-between h-10">
              <p className="bg-white w-[40%] flex items-center justify-center font-bold rounded-[10px] text-[11px] text-black font-semibold p-2">
                Dành cho một người
              </p>
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <img src="/images/crown.svg" alt="" className="p-2" />
              </div>
            </div>
            <p className="text-2xl font-bold my-8">Ezpics Pro</p>
            <p className="text-sm font-normal my-6">
              Tự tay thiết kế mọi thứ hoặc thiết kế cùng bạn bè và gia đình
            </p>
            {selected === "monthly" ? (
              <div>
                <p className="text-[27px] font-bold my-4">
                  200.000 <span className="underline">đ</span>
                </p>
                <p className="text-sm font-normal my-3">
                  /tháng dành cho một thành viên
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[27px] font-bold my-4">
                  1.999.000 <span className="underline">đ</span>
                </p>
                <p className="text-sm font-normal my-3">
                  /năm dành cho một thành viên
                </p>
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex justify-center items-center w-full bg-[rgb(255,66,78)] border-0 pt-2.5 pb-2.5 mt-[15%] rounded-[5px] text-white">
              Bắt đầu bản dùng thử
            </button>
          </div>
          <FeatureList
            features={[
              "Trình biên tập kéo-thả dễ dùng",
              "Hơn 1 triệu mẫu được thiết kế chuyên nghiệp",
              "Hơn 1000 loại thiết kế (bài đăng mạng xã hội và hơn thế nữa)",
              "Hơn 3 triệu ảnh stock và đồ họa",
              "In và giao hàng thiết kế",
              "Đảm bảo tính nhất quán của thương hiệu với tính năng phê duyệt",
              "Xóa nền với chỉ một lần nhấp",
              "Lập kế hoạch và lên lịch cho nội dung đăng trên mạng xã hội",
              "Mẫu cao cấp không giới hạn",
            ]}
            showContactInfo={false}
          />
        </div>
        <div className="w-1/3">
          <div className="w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
            <div className="flex justify-between h-10">
              <p className="bg-white w-[40%] flex items-center justify-center font-bold rounded-[10px] text-[11px] text-black font-semibold p-2">
                Dành cho một người
              </p>
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <img src="/images/crown.svg" alt="" className="p-2" />
              </div>
            </div>
            <p className="text-2xl font-bold my-8">Ezpics Pro Ecoin</p>
            <p className="text-sm font-normal my-6">
              Tự tay thiết kế mọi thứ hoặc thiết kế cùng bạn bè và gia đình
            </p>
            {selected === "monthly" ? (
              <div>
                <p className="text-[27px] font-bold my-4">
                  200 <span className="underline-offset-1">eCoin</span>
                </p>
                <p className="text-sm font-normal my-3">
                  /tháng dành cho một thành viên
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[27px] font-bold my-4">
                  2000 <span className="underline-offset-1">eCoin</span>
                </p>
                <p className="text-sm font-normal my-3">
                  /năm dành cho một thành viên
                </p>
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex justify-center items-center w-full bg-[rgb(255,66,78)] border-0 pt-2.5 pb-2.5 mt-[15%] rounded-[5px] text-white">
              Bắt đầu mua và trải nghiệm
            </button>
          </div>
          <FeatureList
            features={[
              "Trình biên tập kéo-thả dễ dùng",
              "Hơn 1 triệu mẫu được thiết kế chuyên nghiệp",
              "Hơn 1000 loại thiết kế (bài đăng mạng xã hội và hơn thế nữa)",
              "Hơn 3 triệu ảnh stock và đồ họa",
              "In và giao hàng thiết kế",
              "Đảm bảo tính nhất quán của thương hiệu với tính năng phê duyệt",
              "Hỗ trợ khách hàng 24/7",
              "Tạo bản sao thỏa yêu cầu thương hiệu",
              "Ưu tiên tiếp cận dịch vụ hỗ trợ khách hàng*",
              "SSO",
              "Áp dụng tính giá theo số lượng",
              "Xóa nền với chỉ một lần nhấp",
              "Lập kế hoạch và lên lịch cho nội dung đăng trên mạng xã hội",
              "Mẫu cao cấp không giới hạn",
            ]}
            showContactInfo={true}
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
      <ModalUpPro open={open} handleCancel={handleCancel} />
    </div>
  );
};

export default Page;
