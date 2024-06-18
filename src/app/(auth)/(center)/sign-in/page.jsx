"use client";
import { loginByPhone, requestCodeForgotPasswordAPI, saveNewPassAPI } from '@/api/auth';
import { CHANGE_STATUS_AUTH, CHANGE_VALUE_TOKEN } from '@/redux/slices/authSlice';
import styles from '@/styles/auth/sign_in.module.scss';
import { setCookie } from '@/utils/cookie';
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { signIn } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
    phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
    password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});
const schemaConfirm = yup.object().shape({
    phoneConfirm: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
});
const schemaNewPassword = yup.object().shape({
    verificationCode: yup.string().min(4, 'Mã xác thực mới phải có ít nhất 4 ký tự').required('Mã xác thực là bắt buộc'),
    newPassword: yup.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự').required('Mật khẩu mới là bắt buộc'),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp').required('Xác nhận mật khẩu mới là bắt buộc'),
});
export default function Login() {
    const expirationHours = 3;
    const dispatch = useDispatch();
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [phoneConfirm, setPhoneConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [checkForgotPW, setCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [codeForgotPassword, setCodeForgotPassword] = useState('');
    const [codeForgotPasswordError, setcodeForgotPasswordError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [savePasswordError, setSavePasswordError] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    function handleCheckForgot() {
        setCheck(true);
    }

    function handleRollBack() {
        setCheck(false);
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');

        try {
            const checkValidate = await schema.validate({ phone, password }, { abortEarly: false });
            if (checkValidate) {
                setErrors('');
                const repon = await loginByPhone({
                    phone: phone,
                    password: password,
                });
                if (repon.code === 0) {
                    dispatch(CHANGE_STATUS_AUTH(true));
                    dispatch(CHANGE_VALUE_TOKEN(repon?.info_member?.token_web));
                    setCookie("token", repon?.info_member?.token_web, expirationHours);
                    setCookie("user_login", repon?.info_member, expirationHours);
                    router.push('/');
                } else {
                    setLoginError(repon?.messages[0]?.text);
                }
            }
        } catch (err) {
            const errors = err?.inner?.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(errors);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmForgotPassword = async (e) => {
        e.preventDefault();
        setIsConfirming(true)
        setcodeForgotPasswordError('')
        try {
            const checkValidate = await schemaConfirm.validate({ phoneConfirm }, { abortEarly: false });
            if (checkValidate) {
                setErrors('');
                const repon = await requestCodeForgotPasswordAPI({
                    phone: phoneConfirm,
                });
                if (repon.code === 0) {
                    setCodeForgotPassword(repon?.codeForgotPassword)
                } else {
                    setCodeForgotPassword('')
                    setcodeForgotPasswordError(repon?.messages[0]?.text);
                }
            }
        } catch (err) {
            const errors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(errors);
        } finally {
            setIsConfirming(true)
        }
    };
    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        setSavePasswordError('');
        setIsSavingPassword(true)
        try {
            const checkValidate = await schemaNewPassword.validate({ newPassword, confirmNewPassword, verificationCode }, { abortEarly: false });
            if (checkValidate) {
                setErrors('');
                const repon = await saveNewPassAPI({
                    phone: phoneConfirm,
                    code: verificationCode,
                    passNew: newPassword,
                    passAgain: confirmNewPassword
                });
                if (repon.code === 0) {
                    setIsSavingPassword(false)
                    router.push('sign-in')
                } else {
                    setSavePasswordError(repon?.messages[0]?.text);
                }
            }
        } catch (err) {
            const errors = err?.inner?.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setErrors(errors);
        }
        finally {
            setIsSavingPassword(false)
        }
    };
    const handleLoginWithGoogle = () => {
        signIn('google')
    }
    return (
        <div className={styles.container_login}>
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
                                {codeForgotPassword === '' ? (
                                    checkForgotPW ? (
                                        <>
                                            <p className={styles.label_input}>Số điện thoại xác thực</p>
                                            <input
                                                type="text"
                                                value={phoneConfirm}
                                                placeholder="Số điện thoại"
                                                onChange={(e) => setPhoneConfirm(e.target.value)}
                                            />
                                            {errors?.phoneConfirm && <p className={styles.error}>{errors?.phoneConfirm}</p>}
                                            {codeForgotPasswordError && <p className={styles.error}>{codeForgotPasswordError}</p>}
                                            <button
                                                className={styles.confirm}
                                                onClick={handleConfirmForgotPassword}
                                                disabled={isConfirming}
                                            >
                                                {isConfirming ? (
                                                    <Spin
                                                        indicator={
                                                            <LoadingOutlined
                                                                style={{
                                                                    fontSize: 24,
                                                                    color: 'white'
                                                                }}
                                                                spin
                                                            />
                                                        }
                                                    />
                                                ) : (
                                                    'Xác nhận'
                                                )}
                                            </button>
                                            <button className={styles.rollback} onClick={handleRollBack}>
                                                <ArrowLeftOutlined className={styles.icon} />
                                                <p>Quay lại</p>
                                            </button>
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
                                            {errors?.phone && <p className={styles.error}>{errors?.phone}</p>}
                                            <div className={styles.box_pass}>
                                                <p className={styles.label_input}>Mật khẩu</p>
                                                <p className={styles.forgot_pass} onClick={handleCheckForgot}>
                                                    Quên mật khẩu ?
                                                </p>
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {errors?.password && <p className={styles.error}>{errors?.password}</p>}
                                            {loginError && <p className={styles.error}>{loginError}</p>}
                                            <button
                                                type='submit'
                                                className={styles.login}
                                                onClick={handleSubmitLogin}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Spin
                                                        indicator={
                                                            <LoadingOutlined
                                                                style={{
                                                                    fontSize: 24,
                                                                    color: 'white'
                                                                }}
                                                                spin
                                                            />
                                                        }
                                                    />
                                                ) : (
                                                    'Đăng nhập'
                                                )}
                                            </button>
                                            <p className={styles.or}>Hoặc</p>
                                            <button className={styles.register} onClick={handleLoginWithGoogle}>
                                                Đăng nhập bằng Google
                                            </button>
                                            <p className={styles.option_regis}>
                                                Bạn chưa có tài khoản ? - <Link href={'/sign-up'}>Đăng ký</Link>
                                            </p>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <p className={styles.label_input}>Mã xác nhận trong Zalo</p>
                                        <input
                                            type="text"
                                            value={phoneConfirm}
                                            placeholder="Mã xác nhận trong Zalo"
                                            onChange={(e) => setPhoneConfirm(e.target.value)}
                                            className="bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                                            disabled
                                        />
                                        <p className={styles.label_input}>Nhập mã xác thực</p>
                                        <input
                                            type="password"
                                            placeholder="Nhập mã xác thực"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                        {errors?.verificationCode && <p className={styles.error}>{errors?.verificationCode}</p>}
                                        <p className={styles.label_input}>Mật khẩu mới</p>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        {errors?.newPassword && <p className={styles.error}>{errors?.newPassword}</p>}
                                        <p className={styles.label_input}>Nhập lại mật khẩu mới</p>
                                        <input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                        {errors?.confirmNewPassword && <p className={styles.error}>{errors?.confirmNewPassword}</p>}
                                        {savePasswordError && <p className={styles.error}>{savePasswordError}</p>}
                                        <button
                                            className={styles.confirm}
                                            onClick={handleSubmitNewPassword}
                                            disabled={isSavingPassword}
                                        >
                                            {isSavingPassword ? (
                                                <Spin
                                                    indicator={
                                                        <LoadingOutlined
                                                            style={{
                                                                fontSize: 24,
                                                                color: 'white'
                                                            }}
                                                            spin
                                                        />
                                                    }
                                                />
                                            ) : (
                                                'Xác nhận'
                                            )}
                                        </button>
                                        <button className={styles.rollback} onClick={handleRollBack}>
                                            <ArrowLeftOutlined className={styles.icon} />
                                            <p>Quay lại</p>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}