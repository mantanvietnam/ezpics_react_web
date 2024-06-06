"use client";

import React, { useState, useEffect } from "react";
import classes from "@/styles/home/nav.module.scss";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import { UserOutlined } from "@ant-design/icons";

const Nav = () => {
  const navItems = [
    { href: "/", label: "Trang chủ", icon: images.home },
    { href: "/collection-all", label: "Bộ sưu tập", icon: images.collection },
    { href: "/remove", label: "Xóa nền Ezpics", icon: images.remove },
    { href: "/project/recommend", label: "Danh mục", icon: images.category },
  ];

  const [open, setOpen] = useState(false);
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className={classes.navbar}>
      <Link href={"/login"} className={classes.top}>
        <UserOutlined className={classes.login} /> Đăng nhập
      </Link>
      <div className={classes.bottom}>
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
    </div>
  );
};

export default Nav;
