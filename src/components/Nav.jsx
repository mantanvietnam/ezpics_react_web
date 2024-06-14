"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import ModalUpPro from "./ModalUpPro";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import ModalRecharge from "./ModelRecharge";
import { checkAvailableLogin, getCookie } from "@/utils";
import { useSession } from "next-auth/react";

const Nav = ({ isOpen }) => {
  const [openPro, setOpenPro] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);
  const handleCancelPro = () => {
    setOpenPro(false);
  };
  // Lấy data user
  const { data: session } = useSession();
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  // console.log(dataInforUser);

  const handleCancelRecharge = () => {
    setOpenRecharge(false);
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const isAuthenticated = checkAvailableLogin();
  // console.log(isAuthenticated);

  const navItems = [
    { href: "/", label: "Trang chủ", icon: images.home },
    { href: "/collection-all", label: "Bộ sưu tập", icon: images.collection },
    { href: "/remove", label: "Xóa nền Ezpics", icon: images.remove },
    { href: "/project/recommend", label: "Danh mục", icon: images.category },
  ];

  const userFuncs = [
    {
      href: "/your-design/purchase-form",
      label: "Thiết kế của bạn",
      icon: images.design,
    },
    { href: "/ordered", label: "Order mẫu thiết kế", icon: images.order },
    {
      href: "/your-collection/purchase-collection",
      label: "Bộ sưu tập của bạn",
      icon: images.collection2,
    },
    {
      href: "/transaction/table-1",
      label: "Tổng quan giao dịch",
      icon: images.transaction,
    },
    {
      href: "/",
      label: "Gia hạn bản PRO",
      icon: images.renew,
      onClick: () => setOpenPro(true),
    },
  ];

  //Them bg vao button khi chon tren thanh nav
  const [activeItem, setActiveItem] = useState(0);
  const handleNavItem = (item) => {
    setActiveItem(item);
    setActiveFunc(null);
  };
  const [activeFunc, setActiveFunc] = useState("");
  const hanldeFuncItem = (item) => {
    setActiveFunc(item);
    setActiveItem(null);
  };

  return (
    <div
      className={`fixed left-0 top-[var(--header-height)] bg-white border-r border-gray-300 h-screen w-[250px] p-5 box-border flex flex-col gap-2 z-10 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      {isAuthenticated ? (
        <div className="font-bold text-gray-800 no-underline py-2 border-b border-gray-300 cursor-pointer">
          <div className="flex justify-around items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden m-2">
              <Image
                src={dataInforUser?.avatar}
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p>{dataInforUser?.name}</p>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.balance}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full pr-1"
                />{" "}
                <p>: {dataInforUser?.account_balance} ₫</p>
              </div>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.eCoin}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full pr-1"
                />{" "}
                <p>: {dataInforUser?.ecoin} eCoin</p>
              </div>
            </div>
          </div>
          <div className="w-full mt-3" onClick={() => setOpenRecharge(true)}>
            <button className="w-full bg-gray-300 flex h-10 items-center text-center justify-center text-sm text-gray-900 leading-[22px] font-bold rounded-[10px] py-2">
              <CrownOutlined style={{ color: "yellow" }} className="pr-1" /> Nạp
              tiền
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Link
            href={"/sign-in"}
            className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer">
            <UserOutlined className="text-2xl p-[10px] bg-gray-300 rounded-full" />
            <p>Đăng nhập</p>
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-[15px]">
        {navItems.map((navItem, index) => (
          <Link
            key={index}
            href={navItem.href}
            className={`rounded-lg ${activeItem === index && "bg-gray-300"}`}
            onClick={() => handleNavItem(index)}>
            <div className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer">
              <Image
                src={navItem.icon}
                alt=""
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              {navItem.label}
            </div>
          </Link>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col gap-[15px] border-t border-gray-300 pt-1.5">
          {userFuncs.map((userFunc, index) => (
            <Link
              key={index}
              href={userFunc.href}
              className={`rounded-lg ${activeFunc === index && "bg-gray-300"}`}
              onClick={() => hanldeFuncItem(index)}>
              <div
                className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer"
                onClick={userFunc.onClick}>
                <Image
                  src={userFunc.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
                {userFunc.label}
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <ModalUpPro open={openPro} handleCancel={handleCancelPro} />
      <ModalRecharge open={openRecharge} handleCancel={handleCancelRecharge} />
    </div>
  );
};

export default Nav;
