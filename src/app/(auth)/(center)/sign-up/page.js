import React from 'react'
import '../../../../styles/auth/sign_up.css'
const Sign_up = () => {
  return (
    <>
      <div class="form-signup">
        <form action="" class="form-submit">
          <div class="box-left">
            <img src="src/styles/image/img4.jpg" alt="" class="img-singup" />
          </div>
          <div class="box-right">
            <h2 class="title-sign">Ezpics - Dùng là thích! 👋</h2>
            <div class="group-input">
              <p for="">Tên</p>
              <input type="text" placeholder="Tên" />
            </div>
            <div class="group-input">
              <p for="">Số điện thoại</p>
              <input type="text" placeholder="Số điện thoại" />
            </div>
            <div class="group-input">
              <p for="">Email</p>
              <input type="text" placeholder="Email" />
            </div>
            <div class="group-input-pasword">
              <div class="group-input">
                <p for="">Mật khẩu</p>
                <input type="text" placeholder="Mật khẩu" />
              </div>
              <div class="group-input">
                <p for="">Nhập lại mật khẩu</p>
                <input type="text" placeholder="Nhập lại mật khẩu" />
              </div>

            </div>
            <div class="group-input">
              <p for="">Mã giới thiệu</p>
              <input type="text" placeholder="Mã giới thiệu" />
            </div>
            <button type="submit" class="btn-submit-sign">Đăng ký</button>
            <div class="nav-sign">
              <p>Bạn đã có tài khoản ? - <a href="">Đăng nhập</a></p>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Sign_up
