"use client"

import React, { useState, useEffect } from 'react';
import classes from "@/styles/home/nav.module.scss";
import Image from 'next/image';
import Link from 'next/link';
import images from "../../public/images/index2";
import {
    UserOutlined
} from '@ant-design/icons';
import { Button, Modal } from 'antd';

const Nav = () => {
  const navItems = [
    { href: '/', label: 'Trang chủ', icon: images.home },
    { href: '/collection-all', label: 'Bộ sưu tập', icon: images.collection },
    { href: '/remove', label: 'Xóa nền Ezpics', icon: images.remove },
    { href: '/project/recommend', label: 'Danh mục', icon: images.category },
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
                  <Image src={navItem.icon} alt="" width={20} height={20} className={classes.icon} />
                  {navItem.label}
                </div>
              </Link>
            ))}
        </div>
        
      <button className="bg-red-600 text-white rounded px-5 py-2 ml-4 h-fit"
      onClick={() => setOpen(true)}
      >
        Gia hạn bản Pro
      </button>
      {open && (
        <>
         <Modal
            open={open}
            title="Title"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={(_,) => (
              <>
                <Button>Custom Button</Button>
              </>
        )}
      >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
        </>
      )}
    </div>
  )
}

export default Nav
