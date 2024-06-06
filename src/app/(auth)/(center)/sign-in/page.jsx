"use client";
import { loginByPhone } from '@/api/auth';
import styles from '@/styles/auth/sign_in.module.scss';
import Link from "next/link";
import { useState } from "react";
import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
    phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
    password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});
const schemaConfirm = yup.object().shape({
    phoneConfirm: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
});

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [phoneConfirm, setPhoneConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [checkForgotPW, setCheck] = useState(false)

    function handleCheckForgot() {
        setCheck(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const checkValidate = await schema.validate({ phone, password }, { abortEarly: false });
            if (checkValidate) {
                setErrors('');
                try {
                    const repon = await loginByPhone({
                        phone: phone,
                        password: password,
                        type_device: "web",
                    });

                } catch (error) {
                    // if (axios.isAxiosError(error)) {
                    //     setError(error.response?.data?.message || error.message);
                    // } else {
                    //     setError('An unexpected error occurred');
                    // }
                }
            }

        } catch (err) {
            const errors = err?.inner?.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(errors);
        }
    };
    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            const checkValidate = await schemaConfirm.validate({ phoneConfirm }, { abortEarly: false });
            if (checkValidate) {
                setErrors('');
                console.log('Validate thành công');
                console.log('Giá trị phone:', phoneConfirm);
            }
        } catch (err) {
            const errors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(errors);
        }
    };
    return (
        <div className="h-screen w-screen">
            <div className={styles["login-bg"]}>
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40">
                    <div className={styles.padding}>
                        <div className="w-full min-h-full flex justify-center items-center">
                            <div className={styles["login-main"]}>
                                <div className={styles.title}>
                                    Ezpics - Dùng là thích! 👋
                                </div>
                                <p className={styles.description}>
                                    Mời bạn đăng nhập công cụ thiết kế siêu tốc đầu tiên tại Việt Nam
                                </p>
                                {checkForgotPW ? (
                                    <>
                                        <p className={styles.label_input}>Số điện thoại xác thực</p>
                                        <input type="text"
                                            value={phoneConfirm}
                                            placeholder="Số điện thoại"
                                            onChange={(e) => setPhoneConfirm(e.target.value)}
                                        />
                                        {errors.phoneConfirm && <p className={styles.error}>{errors.phoneConfirm}</p>}
                                        <button className={styles.confirm} onClick={handleConfirm}> Xác nhận </button>
                                    </>
                                ) : (
                                    <>
                                        <p className={styles.label_input}>Số điện thoại</p>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                                        <div className={styles.box_pass}>
                                            <p className={styles.label_input}>Mật khẩu</p>
                                            <p className={styles.forgot_pass} onClick={handleCheckForgot}>Quên mật khẩu ?</p>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {errors.password && <p className={styles.error}>{errors.password}</p>}
                                        <button className={styles.login} onClick={handleSubmit}> Đăng nhập </button>
                                        <p className={styles.or}>Hoặc</p>
                                        <button className={styles.register}>Đăng nhập bằng Google</button>
                                        <p className={styles.option_regis}>Bạn chưa có tài khoản ? - <Link href={'/sign-up'}>Đăng ký</Link></p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}