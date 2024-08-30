/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import ModalUpPro from "./ModalUpPro";
import ModalUpDesigner from "./ModalUpDesigner";
import { UserOutlined } from "@ant-design/icons";
import ModalRecharge from "./ModelRecharge";
import { checkAvailableLogin, getCookie } from "@/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const Nav = ({
  isOpen,
  closeNavbar,
  activeItem,
  setActiveItem,
  handleNavItem,
  activeFunc,
  setActiveFunc,
  hanldeFuncItem,
}) => {
  const [openPro, setOpenPro] = useState(false);
  const [openDesigner, setOpenDesigner] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);

  const handleCancelPro = () => {
    setOpenPro(false);
  };
  const handleCancelDesigner = () => {
    setOpenDesigner(false);
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

  // Determine if the user is a Pro member
  const isProMember = dataInforUser?.member_pro === 1;

  const handleCancelRecharge = () => {
    setOpenRecharge(false);
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const isAuthenticated = checkAvailableLogin();
  // console.log(isAuthenticated);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Trang chủ", icon: images.home },
      { href: "/collection-all", label: "Bộ sưu tập", icon: images.collection },
      { href: "/remove", label: "Xóa nền Ezpics", icon: images.remove },
      { href: "/project", label: "Danh mục", icon: images.category },
    ],
    []
  );

  const userFuncs = useMemo(
    () => [
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
        label: `${isProMember ? "Gia hạn bản PRO" : "Dùng thử bản PRO"}`,
        icon: images.renew,
        onClick: () => setOpenPro(true),
      },
      {
        href: "/",
        label: "Đăng kí Designer",
        icon: images.renew,
        onClick: () => setOpenDesigner(true),
      },
    ],
    [isProMember]
  );

  const pathname = usePathname();

  useEffect(() => {
    const navItemIndex = navItems.findIndex((item) => item.href === pathname);
    const funcItemIndex = userFuncs.findIndex((item) => item.href === pathname);

    if (navItemIndex !== -1) {
      setActiveItem(navItemIndex);
      setActiveFunc(null);
    } else if (funcItemIndex !== -1) {
      setActiveFunc(funcItemIndex);
      setActiveItem(null);
    }
  }, [navItems, pathname, userFuncs]);

  return (
    <div
      className={`fixed left-0 top-[var(--header-height)] h-[calc(100%-64px)] bg-white border-r border-gray-300 w-[250px] p-5 box-border flex flex-col gap-2 z-50 transition-transform duration-300 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      {isAuthenticated ? (
        <div className="font-bold text-gray-800 no-underline py-2 border-b border-gray-300 cursor-pointer">
          <div className="relative flex justify-around items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden m-2">
              <Image
                src={dataInforUser?.avatar}
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {isProMember && (
              <Image
                src="/images/crown.png"
                alt=""
                width={18}
                height={18}
                className="absolute bottom-[10%] left-[20%]"
              />
            )}
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
                <p>: {VND.format(dataInforUser?.account_balance)}</p>
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
            <button className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 flex h-12 items-center text-center justify-center text-sm text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              <p className="flex items-center space-x-2">
                <img src="/images/crown.png" alt="" className="w-5 h-5" />
                <span className="text-lg">Nạp tiền</span>
              </p>
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

      <ModalUpPro
        isProMember={isProMember}
        open={openPro}
        handleCancel={handleCancelPro}
      />
      <ModalUpDesigner
        open={openDesigner}
        handleCancel={handleCancelDesigner}
      />
      <ModalRecharge open={openRecharge} handleCancel={handleCancelRecharge} />
    </div>
  );
};

export default Nav;
