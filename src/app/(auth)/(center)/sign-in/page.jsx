"use client";
import { Button, Input } from "antd";
import styles from '@/styles/auth/sign_in.module.css'

import { useState } from "react";
export default function Login() {
    const [checkForgotPW, setCheck] = useState(false)
    function handleCheckForgot() {
        setCheck(true)
    }
    return (
        <div className={styles["login-bg"]}>
            <div className={styles["login-custom"]}>
                <div className={styles["login-main"]}>
                    <h3>Ezpics - Dùng là thích! 👋</h3>
                    <p>Mời bạn đăng nhập công cụ thiết kế siêu tốc đầu tiên tại Việt Nam</p>
                    {
                        checkForgotPW ?
                            <>
                                <p className={styles["phone-number"]}>Số điện thoại Xác thực</p>
                                <Input size="large" placeholder="Số điện thoại" />
                            </> :
                            <>
                                <p className={styles["phone-number"]}>Số điện thoại</p>
                                <Input size="large" placeholder="Số điện thoại" />
                                <div className={styles["pass"]}>
                                    <p className="password">Mật khẩu</p>
                                    <p className={styles["forgot-password"]} onClick={handleCheckForgot}>Quên mật khẩu</p>
                                </div>
                                <Input size="large" className={styles["input-pass"]} placeholder="Mật khẩu" />
                                <Button type="primary" className={styles["login-account"]}>Đăng nhập</Button>
                                <p className={styles.or}>hoặc</p>
                                <Button className={styles["login-gg"]} type="primary" danger>Đăng nhập bằng Google</Button>
                                <div className="sign-up">
                                    <p>Bạn chưa có tài khoản ? - <a href="" className={styles["sign-up-button"]}>Đăng kí</a></p>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}