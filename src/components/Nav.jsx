"use client"
import React, { useEffect, useState } from 'react';
import classes from "@/styles/home/nav.module.scss";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import ModalUpPro from './ModalUpPro';
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import axios from 'axios';
import { checkAvailableLogin, checkTokenCookie } from '@/utils';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [dataUser, setDataUser] = useState()
  const handleCancel = () => {
    setOpen(false);
  };
  const isAuth = checkAvailableLogin()

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`https://apis.ezpics.vn/apis/getInfoMemberAPI`, {
        token: checkTokenCookie(),
        // token: 'dkrczfq9volCGwVnXuEKPOsjSM5TUQ1678707625'

      });
      if (response.data && response.data.code === 0) {
        setDataUser(response.data.data);
        console.log('response', response)
      }
    };
    getData();
  }, []);
  console.log('data imgae', dataUser)
  const formattedBalance = dataUser?.account_balance?.toLocaleString('vi-VN');

  // const [isAuthenticated, setIsAuthenticated] = useState(true);
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
      {isAuth ? (
        <div className={classes.top}>
          <Link href={"/"}>
            <div className={classes.profile}>
              <Image
                src={dataUser?.avatar}
                alt=""
                width={40}
                height={40}
                className={classes.avatar}
              />
            </div>
            <div className={classes.info}>
              <p className={classes.name}>{dataUser?.name}</p>
              <p className={classes.balance}>
                <Image
                  src={images.balance}
                  alt=""
                  width={20}
                  height={20}
                  className={classes.avatar}
                /> : {formattedBalance}
              </p>
              <p className={classes.eCoin}>
                <Image
                  src={images.eCoin}
                  alt=""
                  width={20}
                  height={20}
                  className={classes.avatar}
                /> : {dataUser?.ecoin} eCoin
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

      {isAuth ? (
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
