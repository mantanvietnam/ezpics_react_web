"use client";
import "./login.css"

import { Input,Button } from 'antd';
import { useState } from "react";
export default function Login(){
    const [checkForgotPW,setCheck] = useState(false)
    function handleCheckForgot(){
setCheck(true)
    }
    return(
        <div className="login-bg">
            <div className="login-custom">
            <div className="login-main">
                <h3>Ezpics - Dùng là thích! 👋</h3>
                <p>Mời bạn đăng nhập công cụ thiết kế siêu tốc đầu tiên tại Việt Nam</p>
                {
                    checkForgotPW?
                    <>
                    <p className="phone-number">Số điện thoại Xác thực</p>
                <Input size="large" placeholder="Số điện thoại" />
                    </>:
                    <>
                    <p className="phone-number">Số điện thoại</p>
                     <Input size="large" placeholder="Số điện thoại" />
                     <div className="pass">
                     <p className="password">Mật khẩu</p>
                     <p className="forgot-password" onClick={handleCheckForgot}>Quên mật khẩu</p>
                     </div>
                     <Input size="large" className="input-pass" placeholder="Mật khẩu" />
                     <Button type="primary" className="login-account">Đăng nhập</Button>
                     <p className="or">hoặc</p>
                     <Button  className="login-gg" type="primary" danger>Đăng nhập bằng Google</Button>
                     <div className="sign-up">
                         <p>Bạn chưa có tài khoản ? - <a href="" className="sign-up-button">Đăng kí</a></p>
                     </div>
                    </>
                }
            </div>
            </div>
        </div>
    )
}