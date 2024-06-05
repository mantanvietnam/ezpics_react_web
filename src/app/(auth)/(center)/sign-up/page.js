'use client'
import React from 'react'
import '../../../../styles/auth/sign_up.css'
import { images } from '../../../../../public/images'
import Image from "next/image";
import { useFormik } from 'formik';
import { register } from '@/api/auth';
import { toast } from 'react-toastify';
// import { getToken } from '@/config/firebase-config';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/config/firebase-config';

const Sign_up = () => {
  // main.js

const vapidKey = "YOUR_VAPID_KEY"; // Được lấy từ Firebase console

// getToken(messaging, { vapidKey }).then((currentToken) => {
//   if (currentToken) {
//     console.log('FCM Token:', currentToken);
//   } else {
//     console.log('No registration token available. Request permission to generate one.');
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
// });
  const {
    values,
    handleBlur,
    errors,
    touched,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      password_again: '',
      affsource: ''
    },
    validate: (values) => {
      const errors = {}
      if (!values.name || values.name.length <= 6) {
        errors.name = 'Phải chứa ít nhất 6 ký tự '
      }
      if (!values.phone || values.phone.length <= 8) {
        errors.phone = 'Phải chứa ít nhất 8 số '
      }
      if (!values.email) {
        errors.email = 'Yêu cầu  email'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Yêu cầu  email'
      }
      if (!values.password) {
        errors.password = 'Yêu cầu mật khẩu'
      } else if (values.password.length < 8) {
        errors.password = 'Mặt khẩu phải trên 8 ký tự'
      }
      if (!values.password_again) {
        errors.password_again = 'Bắt buộc phải nhập lại mật khẩu'
      } else if (values.password_again.length < 6) {
        errors.password_again = 'Nhập lại mật khẩu phải lớn hơn 6 ký tự'
      } else if (values.password_again !== values.password) {
        errors.password_again = 'Mật khẩu  không khớp, thử nhập lại'
      }
      return errors
    },
    onSubmit: (values) => {
      if (values){

        toast.success('thành công rồi nè')
      }
      console.log(values)
      // register(values)
    }

  })
  return (
    <>
      <div class="form-signup">
        <form onSubmit={handleSubmit} action="" class="form-submit">
          <div class="box-left">
            {/* Image */}
            <Image
              className="object-contain rounded_image"
              priority={true}
              src={images.imgsignup}
              alt="Ezpics Logo"
              class="img-singup"
            />
          </div>
          <div class="box-right">
            <h2 class="title-sign">Ezpics - Dùng là thích! 👋</h2>
            <div class="group-input">
              <p for="">Tên</p>
              <input type="text" placeholder="Tên" name='name'
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched.name &&
                errors.name && (
                  <span className="text-red-500 text-base">
                    {errors.name}
                  </span>
                )}
            </div>
            <div class="group-input">
              <p for="">Số điện thoại</p>
              <input type="text" placeholder="Số điện thoại" name='phone'
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched.phone &&
                errors.phone && (
                  <span className="text-red-500 text-base">
                    {errors.phone}
                  </span>
                )}
            </div>
            <div class="group-input">
              <p for="">Email</p>
              <input type="text" placeholder="Email" name='email'
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched.email &&
                errors.email && (
                  <span className="text-red-500 text-base">
                    {errors.email}
                  </span>
                )}
            </div>
            <div class="group-input-pasword">
              <div class="group-input">
                <p for="">Mật khẩu</p>
                <input type="text" placeholder="Mật khẩu" name='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.password &&
                  errors.password && (
                    <span className="text-red-500 text-base">
                      {errors.password}
                    </span>
                  )}
              </div>
              <div class="group-input">
                <p for="">Nhập lại mật khẩu</p>
                <input type="text" placeholder="Nhập lại mật khẩu" name='password_again'
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.password_again &&
                  errors.password_again && (
                    <span className="text-red-500 text-base">
                      {errors.password_again}
                    </span>
                  )}
              </div>

            </div>
            <div class="group-input">
              <p for="">Mã giới thiệu</p>
              <input type="text" placeholder="Mã giới thiệu" name='affsource'
                onBlur={handleBlur}
                onChange={handleChange}
              />
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
