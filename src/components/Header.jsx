"use client";
import {
  BarsOutlined,
  BellOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { images } from "../../public/images";
import "@/styles/home/header.scss";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter()
  const menuItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/new-product", label: "Thiết kế mới " },
    { href: "/pricing-compare", label: "Bảng giá" },
    { href: "/", label: "Hướng dẫn" },
    { href: "/", label: "Nhà phát triển" },
  ];

  const actionIcons = [
    {
      icon: <DesktopOutlined style={{ fontSize: "20px" }} />,
      name: "dowload",
      desc: "Tải xuống ứng dụng",
    },
    {
      icon: <SettingOutlined style={{ fontSize: "20px" }} />,
      name: "setting",
      desc: "Cài đặt",
    },
    {
      icon: <BellOutlined style={{ fontSize: "20px" }} />,
      name: "bell",
      desc: "Thông báo",
    },
  ];

  return (
    <div className="fixed w-full z-50 flex justify-between h-[--header-height] px-6 shadow-xl bg-white">
      <div className="flex justify-center items-center">
        <div className="p-3 mr-4 icon-primary">
          <BarsOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="logo flex items-center justify-center">
          <Link href="/" className="flex flex-center">
            <Image
              className="object-contain rounded_image"
              priority={true}
              src={images.logo}
              width={40}
              height={44}
              alt="Ezpics Logo"
            />
          </Link>
        </div>

        <div className="menu flex">
          {menuItems.map((menuItem, index) => (
            <div key={index} href={menuItem.href} className="primary_btn pl-10">
              {menuItem.label}
            </div>
          ))}
        </div>
      </div>

      <div className="action flex justify-center items-center">
        {actionIcons.map((social, index) => (
          <div className="icon-container" key={index}>
            <div className="p-3 icon-primary">{social.icon}</div>
            <div className="desc">{social.desc}</div>
          </div>
        ))}
        <button className="button-red">Tạo thiết kế</button>
        <button className="flex border-red-600 text-red-600 border-2 rounded px-5 py-2 mx-4" onClick={() => {
          router.push('sign-in')
        }}>
          <UserOutlined />
          <p className="pl-2">Đăng nhập</p>
        </button>
      </div>
    </div>
  );
};

export default Header;
