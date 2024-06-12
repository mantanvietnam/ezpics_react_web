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
import "@/styles/home/header.scss";
import { useRouter } from "next/navigation";
import { Divider, Dropdown, Space } from "antd";
import images, { designIcon } from "../../public/images/index2";

const Header = () => {
  const router = useRouter();
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
      name: "download",
      desc: "Tải xuống ứng dụng",
      href: "/download",
    },
    {
      icon: <SettingOutlined style={{ fontSize: "20px" }} />,
      name: "setting",
      desc: "Cài đặt",
      href: "/information",
    },
    {
      icon: <BellOutlined style={{ fontSize: "20px" }} />,
      name: "bell",
      desc: "Thông báo",
    },
  ];

  const items = [
    {
      label: (
        <div className="list-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 6.165V19a2 2 0 0 0 2 2h12.835c-.06-.05-.12-.102-.176-.159L16.318 19.5H5a.5.5 0 0 1-.5-.5V7.682L3.159 6.341A2.275 2.275 0 0 1 3 6.165ZM17.28 4.22a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72H6.56l.72.72a.75.75 0 0 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 1.06L6.56 4h8.38l-.72-.72a.75.75 0 0 1 1.06-1.06l2 2ZM19.78 19.78a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V9.06l-.72.72a.75.75 0 1 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L20 9.06v8.38l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2Z"
              fill="black"></path>
          </svg>
          <p className="item-text">Cỡ tùy chỉnh</p>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div class="list-item border-b-[0.5px] border-[#BFC4C8]">
          <Image src={designIcon.paperRolls} alt="" className="w-6 h-6" />
          <p className="item-text">Mẫu in hàng loạt</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <p className="m-0 text-[rgba(13,18,22,0.7)] text-[14px] font-semibold pt-1.5 pl-3">
          Đề xuất
        </p>
      ),
      key: "2",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.presentation} alt="" className="w-6 h-6" />
          <p className="item-text">Bài thuyết trình (16:9)</p>
          <span className="size">1920 x 1080 px</span>
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.presentation} alt="" className="w-6 h-6" />
          <p className="item-text">Bài thuyết trình (9:16)</p>
          <span className="size">1080 x 1920 px</span>
        </div>
      ),
      key: "4",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.picture} alt="" className="w-6 h-6" />
          <p className="item-text">Logo</p>
          <span className="size">500 x 500 px</span>
        </div>
      ),
      key: "5",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.poster} alt="" className="w-6 h-6" />
          <p className="item-text">Poster (dọc)</p>
          <span className="size">4960 x 7015 px</span>
        </div>
      ),
      key: "6",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.instagram} alt="" className="w-6 h-6" />
          <p className="item-text">Bài đăng Instagram (vuông)</p>
          <span className="size">1080 x 1080 px</span>
        </div>
      ),
      key: "7",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Bài đăng Facebook (vuông)</p>
          <span className="size">940 x 788 px</span>
        </div>
      ),
      key: "8",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Avatar Facebook</p>
          <span className="size">761 x 761 px</span>
        </div>
      ),
      key: "9",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Ảnh bìa Facebook</p>
          <span className="size">1640 x 924 px</span>
        </div>
      ),
      key: "10",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.youtube} alt="" className="w-6 h-6" />
          <p className="item-text">Ảnh thumbnail video Youtube</p>
          <span className="size">1280 x 720 px</span>
        </div>
      ),
      key: "11",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.picture} alt="" className="w-6 h-6" />
          <p className="item-text">Hình nền máy tính </p>
          <span className="size">1920 x 1080 px</span>
        </div>
      ),
      key: "12",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A0 (dọc) </p>
          <span className="size">3179 x 4494 px</span>
        </div>
      ),
      key: "13",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A1 (dọc) </p>
          <span className="size">2245 x 3179 px</span>
        </div>
      ),
      key: "14",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A2 (dọc) </p>
          <span className="size">1578 x 2245 px</span>
        </div>
      ),
      key: "15",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A3 (dọc) </p>
          <span className="size">1123 x 1578 px</span>
        </div>
      ),
      key: "16",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A4 (dọc) </p>
          <span className="size">794 x 1123 px</span>
        </div>
      ),
      key: "17",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A5 (dọc) </p>
          <span className="size">559 x 794 px</span>
        </div>
      ),
      key: "18",
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
            <Link
              key={index}
              href={menuItem.href}
              className="primary_btn pl-10">
              {menuItem.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="action flex justify-center items-center">
        {actionIcons.map((social, index) =>
          index === 2 ? (
            <div className="icon-container" key={index}>
              <div className="p-3 icon-primary">{social.icon}</div>
              <div className="desc">{social.desc}</div>
            </div>
          ) : (
            <Link className="icon-container" key={index} href={social.href}>
              <div className="p-3 icon-primary">{social.icon}</div>
              <div className="desc">{social.desc}</div>
            </Link>
          )
        )}
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          arrow={true}
          dropdownRender={() => (
            <div
              style={{
                maxHeight: "400px",
                background: "white",
                overflowY: "overlay",
                borderRadius: "10px",
                scrollbarWidth: "thin",
                scrollbars: "false",
              }}>
              {items.map((item) => (
                <div key={item.key}>{item.label}</div>
              ))}
            </div>
          )}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <button className="button-red">Tạo thiết kế</button>
            </Space>
          </a>
        </Dropdown>
        <button
          className="flex border-red-600 text-red-600 border-2 rounded px-5 py-2 mx-4"
          onClick={() => {
            router.push("sign-in");
          }}>
          <UserOutlined />
          <p className="pl-2">Đăng nhập</p>
        </button>
      </div>
    </div>
  );
};

export default Header;
