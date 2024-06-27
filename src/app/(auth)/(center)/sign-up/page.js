'use client'
import React, { useState } from 'react'
import '../../../../styles/auth/sign_up.css'
import { images } from '../../../../../public/images'
import Image from "next/image";
import { useFormik } from 'formik';
import { register } from '@/api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/utils';
import { CHANGE_STATUS_AUTH, CHANGE_VALUE_TOKEN } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const Sign_up = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const expirationHours = 3;

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
      affsource: '',
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
      setIsLoading(true);

      register(values)
        .then(response => {
          console.log(response)
          if (response?.code === 0) {
            toast.success('thành công ! chúng tôi đang chuyển hướng tới xác thực số điện thoại')
            dispatch(CHANGE_STATUS_AUTH(true));
            dispatch(CHANGE_VALUE_TOKEN(response?.info_member?.token_web));
            setCookie("token", response?.info_member?.token_web, expirationHours);
            setCookie("user_login", response?.info_member, expirationHours);
            // alert('thành công')
            setTimeout(() => {
              router.push('/OtpVerification')
            }, 3000)
            console.log(response.code)
          } else if (response.code === 2) {
            toast.warning('gửi thiếu dữ liệu =)))')
          } else if (response.code === 3) {
            toast.warning('Số điện thoại này đãn tồn tại')

          } else if (response.code === 4) {
            alert('pass nhập lại sai')
            toast.error('pass nhập lại sai')

          }
        }).then(() => {
          setIsLoading(false);
          // setTimeout(() => {
          //   router.push('/sign-in');
          // }, 2000);
        })
        .catch(error => {
          console.error('Đã xảy ra lỗi khi đăng ký:', error);
        })

    }

  })
  return (
    <>
      <div className="form-signup">
        <form onSubmit={handleSubmit} action="" className="form-submit">
          <div className="box-left">
            {/* Image */}
            <Image
              className="object-contain rounded_image img-singup"
              priority={true}
              src={images.imgsignup}
              alt="Ezpics Logo"
            />
          </div>
          <div className="box-right">
            <h2 className="title-sign">Ezpics - Dùng là thích! 👋</h2>
            <div className="group-input">
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
            <div className="group-input">
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
            <div className="group-input">
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
            <div className="group-input-pasword">
              <div className="group-input">
                <p for="">Mật khẩu</p>
                <input type="password" placeholder="Mật khẩu" name='password'
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
              <div className="group-input">
                <p for="">Nhập lại mật khẩu</p>
                <input type="password" placeholder="Nhập lại mật khẩu" name='password_again'
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
            <div className="group-input">
              <p for="">Mã giới thiệu</p>
              <input type="text" placeholder="Mã giới thiệu" name='affsource'
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-submit-sign">                                            
              {isLoading ? <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 24,
                    color: 'white'
                  }}
                  spin
                />
              }
            /> : 'Đăng ký'}
            </button>
            <div className="nav-sign">
              <p>Bạn đã có tài khoản ? - <a href="/sign-in">Đăng nhập</a></p>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Sign_up
