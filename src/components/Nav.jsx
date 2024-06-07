"use client"
import React, { useState } from 'react';
import classes from "@/styles/home/nav.module.scss";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import ModalUpPro from './ModalUpPro';
import { UserOutlined, CrownOutlined } from "@ant-design/icons";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navItems = [
    { href: "/", label: "Trang chủ", icon: images.home },
    { href: "/collection-all", label: "Bộ sưu tập", icon: images.collection },
    { href: "/remove", label: "Xóa nền Ezpics", icon: images.remove },
    { href: "/project/recommend", label: "Danh mục", icon: images.category },
  ];
  
  const userFuncs = [
    { href: "/your-design/purchase-form", label: "Thiết kế của bạn", icon: images.design },
    { href: "/ordered", label: "Order mẫu thiết kế", icon: images.order },
    { href: "/your-collection/purchase-collection", label: "Bộ sưu tập của bạn", icon: images.collection2 },
    { href: "/transaction/table-1", label: "Tổng quan giao dịch", icon: images.transaction },
    { 
      href: "/", 
      label: "Gia hạn bản PRO", 
      icon: images.renew, 
      onClick: () => setOpen(true)
    },
  ];

  return (
    <div className={classes.navbar}>
      { isAuthenticated ? (
        <div className={classes.top}>
          <Link href={"/"}>
            <div className={classes.profile}>
              <Image 
                src={images.defaultAvatar}
                alt=""
                width={40}
                height={40}
                className={classes.avatar}
              />
            </div>
            <div className={classes.info}>
              <p className={classes.name}>Name</p>
              <p className={classes.balance}>
                <Image 
                  src={images.balance}
                  alt=""
                  width={20}
                  height={20}
                  className={classes.avatar}
                /> : 0₫
              </p>
              <p className={classes.eCoin}>
              <Image 
                  src={images.eCoin}
                  alt=""
                  width={20}
                  height={20}
                  className={classes.avatar}
                /> : 109 eCoin
              </p>
            </div>
          </Link>
          <button className={classes.cashIn}> <CrownOutlined style={{ color: "yellow" }} /> Nạp tiền</button>
        </div>
      ) : (
        <div className={classes.top}>
          <Link href={"/login"}>
            <UserOutlined className={classes.login} /> Đăng nhập
          </Link>
        </div>
      )}
      <div className={classes.middle}>
        {navItems.map((navItem, index) => (
          <Link key={index} href={navItem.href}>
            <div className={classes.navItem}>
              <Image
                src={navItem.icon}
                alt=""
                width={20}
                height={20}
                className={classes.icon}
              />
              {navItem.label}
            </div>
          </Link>
        ))}
      </div>

      {isAuthenticated ? (
        <div className={classes.bottom}>
          {userFuncs.map((userFunc, index) => (
            <Link key={index} href={userFunc.href}>
              <div className={classes.userFunc} onClick={userFunc.onClick}>
                <Image
                  src={userFunc.icon}
                  alt=""
                  width={20}
                  height={20}
                  className={classes.icon}
                />
                {userFunc.label}
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <ModalUpPro open={open} handleCancel={handleCancel} />
    </div>
  );
};

export default Nav;
