"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Ezpics from "public/images/EZPICS.png";

const Footer = () => {
  const socialIcons = [
    {
      icon: faFacebookF,
      name: "Facebook",
      parentClass: "facebook-icon pl-2",
      link: "https://www.facebook.com/ezpicsvn",
    },
    {
      icon: faInstagram,
      name: "Instagram",
      parentClass: "instagram-icon pb-2",
      link: "https://www.instagram.com/ezpicsvn",
    },
    {
      icon: faTiktok,
      name: "Tiktok",
      parentClass: "tiktok-icon pb-2",
      link: "https://www.tiktok.com/@ezpicsvn",
    },
    {
      icon: faYoutube,
      name: "YouTube",
      parentClass: "youtube-icon pb-2",
      link: "https://www.youtube.com/@ezpicsvn",
    },
  ];

  const pageItems = [
    { label: "Chính sách quyền riêng tư", link: "https://ezpics.vn/post/27" },
    { label: "Hình thức thanh toán", link: " https://ezpics.vn/post/28" },
    { label: "Chính sách bảo mật", link: "https://ezpics.vn/post/29" },
    {
      label: "Hướng dẫn sử dụng ",
      link: "https://www.youtube.com/playlist?list=PLngg14zy8vvwLxThvcL8g35G0F9VlNXUh",
    },
  ];

  return (
    <div className="w-full z-40 bg-[#333] text-white bottom-0 px-15 md:px-5">
      <div className="padding_content flex flex-col ">
        <div className="top w-full py-7 flex flex-col sm:flex-row sm:justify-between">
          <div className="info w-full sm:w-1/4 relative flex flex-col w-full sm:w-56">
            <div className="logo flex flex-col items-center justify-center">
              <Link href="/" className="flex flex-center">
                <Image
                  className="object-contain rounded_image"
                  priority={true}
                  src={Ezpics}
                  width={80}
                  height={80}
                  alt="Ezpics Logo"
                />
              </Link>
              <div className="pl-10 mobile:pl-20 sm:pl-5">
                <p className="w-fit font-bold py-5">CÔNG TY TNHH EZPICS</p>
                <p className="footer_text text_white pb-7">
                  <strong>Mã số thuế: </strong>0110457409
                </p>
                <p className="footer_text text_white pb-7">
                  <strong>Đại diện pháp luật: </strong>Đặng Thị Thanh Hường
                </p>
              </div>
            </div>
          </div>

          <div className="pages w-full sm:w-1/2 flex flex-row justify-between">
            <div className="flex flex-col w-1/2 sm:pl-10 px-5">
              <p className="footer_text font-semibold text-lg text_white pb-7">
                Bạn cần hỗ trợ
              </p>
              <p className="footer_text text-2xl font-bold text_white pb-5">
                081.656.0000
              </p>
              <p className="footer_text text_white pb-7">
                <strong>Địa chỉ: </strong>số 12 ngách 22/88 Kim Quan, Phường
                Việt Hưng, Quận Long Biên, Thành phố Hà Nội
              </p>
              <p className="footer_text text_white pb-7">
                <strong>Email: </strong>ezpicsvn@gmail.com
              </p>
            </div>
            <div className="flex flex-col w-1/2 px-5">
              <p className="footer_text font-semibold text-lg text_white pb-7">
                Hướng dẫn sử dụng
              </p>
              {pageItems.map((pageItem, index) => (
                <Link key={index} href={pageItem.link}>
                  <p className="footer_text py-3 hover:underline">
                    {pageItem.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="contact w-full sm:w-1/4 flex flex-col  items-center sm:items-start">
            <p className="font-semibold text-lg pb-7">
              Follow Us On Social Media
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((iconItem, index) => (
                <Link
                  key={index}
                  href={iconItem.link}
                  target="_blank"
                  className={iconItem.parentClass}>
                  <FontAwesomeIcon icon={iconItem.icon} size="2x" />
                </Link>
              ))}
            </div>
            <p className="font-semibold text-lg pt-7 pb-4">
              Thông tin thanh toán
            </p>
            <div className="flex flex-col">
              <p>* Số tài khoản: 10110457409</p>
              <p>* Chủ tài khoản: Công ty TNHH Ezpics</p>
              <p>* Ngân hàng: Ngân hàng TMCP Việt Nam Thịnh Vượng</p>
            </div>
          </div>
        </div>

        <div className="bottom flex justify-center items-center">
          <p className="footer_text pb-7 px-3">
            © Bản quyền thuộc về Ezpics | Cung cấp bởi CÔNG TY TNHH EZPICS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
