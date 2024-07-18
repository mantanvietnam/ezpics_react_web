/* eslint-disable @next/next/no-img-element */
"use client";

import { GlobalOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import ModalUpPro from "@/components/ModalUpPro";
import FeatureList from "@/components/PricingCompare/FeatureList";
import { memberTrialProAPI } from "@/api/transaction";
import { checkTokenCookie } from "@/utils/cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const [selected, setSelected] = useState("monthly");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = (buttonType) => {
    setSelected(buttonType);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleTrialButtonClick = async () => {
    let token = checkTokenCookie();

    try {
      const response = await memberTrialProAPI({ token: token });

      if (response?.code === 1) {
        toast.success(response.mess);
        router.push("/sign-in");
      } else {
        toast.info(response.mess);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
    // console.log("test")
  };

  return (
    <div className="w-full">
      <h1 className="min-h-[4%] mobile:min-h-[6%] md:min-h-[10%] xl:min-h-[20%] flex justify-center text-xl mobile:text-2xl xl:text-5xl font-bold pt-[8%] bg-radial-gradient whitespace-nowra">
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

      <div className="md:flex flex-row pt-[6%] px-[2%] xl:px-[5%]">
        <div className="w-full">
          <p className="text-base pb-2 w-[90%]">
            <strong className="font-bold">Chu kì: </strong>
            <span className="text-purple-700">Tiết kiệm 16% </span>
            khi thanh toán theo năm
          </p>
          <div className="w-1/2 md:w-1/3 h-[56px] md:h-[80%] flex items-center border-solid border border-slate-400 rounded-lg px-2 mb-4">
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

      <div className="flex flex-col md:flex-row pt-[6%] px-[2%] xl:px-[5%]">
        <div className="w-full md:w-1/3 mb-3">
          <div className="w-full md:w-[95%] xl:w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
            <div className="h-10 flex">
              <p className="bg-white w-[40%] flex items-center justify-center font-bold rounded-[10px] text-[11px] text-black p-[2%]">
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
            <button
              className="flex justify-center items-center w-full bg-[#515558] border-0 pt-2.5 pb-2.5 md:mt-[15%] rounded-[5px] text-white"
              onClick={() => handleTrialButtonClick()}>
              Bắt đầu dùng thử 7 ngày
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
        <div className="w-full md:w-1/3 mb-3">
          <div className="w-full md:w-[95%] xl:w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
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
              className="flex justify-center items-center w-full bg-[rgb(255,66,78)] border-0 pt-2.5 pb-2.5 md:mt-[15%] rounded-[5px] text-white">
              Bắt đầu đăng kí Pro
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
        <div className="w-full md:w-1/3 mb-3">
          <div className="w-full md:w-[95%] xl:w-[90%] bg-[#f2f3f5] p-6 rounded-tl-[10px] rounded-tr-[10px]">
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
              className="flex justify-center items-center w-full bg-[rgb(255,66,78)] border-0 pt-2.5 pb-2.5 md:mt-[15%] rounded-[5px] text-white">
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

      <div className="w-full h-30 border-t border-[rgb(225,228,231)] mobile:flex justify-between items-center py-[3%] pl-[5%] mobile:px-[5%] mt-5 mobile:mt-10">
        <button className="border border-[rgb(225,228,231)] bg-white flex w-[220px] items-center justify-between px-3 pb-3">
          <GlobalOutlined className="text-xl" />
          <p className="pr-[2%] pl-[2%] my-3 text-[rgb(13,18,22)] text-sm">
            Tiếng Việt (Việt Nam)
          </p>
          <DownOutlined />
        </button>
        <p className="pb-3">© 2024 Mọi quyền được bảo lưu, Ezpics®</p>
        <a href="https://www.facebook.com/ezpicsvn" className="pb-3">
          <img src="/images/fb_logo.png" alt="" className="w-[20px] h-[20px]" />
        </a>
      </div>
      <ModalUpPro open={open} handleCancel={handleCancel} />
    </div>
  );
};

export default Page;
