'use client'
import React, { useState } from 'react';
// import styles from '../../../../styles/auth/otp_verification.module.scss';
import styles from './otp_verification.module.scss'
import { acceptMemberAPI, SendOtp } from '@/api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { checkTokenCookie, getCookie } from '@/utils';

const OtpVerification = ({ phone }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const router = useRouter();
    const token = checkTokenCookie()
    console.log(token)
    // Lấy data user
    let dataInforUser;
    if (getCookie("user_login")) {
        dataInforUser = JSON.parse(getCookie("user_login"));
    } else if (session?.user_login) {
        dataInforUser = session?.user_login;
    } else {
        dataInforUser = null;
    }
    console.log(dataInforUser)
    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await SendOtp({ phone: dataInforUser?.phone }); // Gọi hàm sendOtp để nhận lại mã OTP mới
            if (response?.code == 0) {
                console.log('response::',response);
                toast.success('Mã OTP đã được gửi lại !');
                setOtp(['', '', '', '', '', '']); // Reset lại các ô nhập OTP
                setIsOtpSent(true); // Đã gửi mã OTP thành công
                document.getElementById('otp-input-0').focus(); // Focus vào ô nhập OTP đầu tiên
            } else {
                toast.error('Không thể gửi lại mã OTP, vui lòng thử lại sau.');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại....');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await SendOtp({ phone: dataInforUser?.phone }); // Gọi hàm sendOtp để nhận mã OTP
            if (response?.code == 0) {
                console.log('respone: ', response)
                toast.success('Đã gửi mã OTP!2');
                setIsOtpSent(true); // Đã gửi mã OTP thành công
                document.getElementById('otp-input-0').focus(); // Focus vào ô nhập OTP đầu tiên
            } else {
                toast.error('Không thể gửi mã OTP, vui lòng thử lại sau.');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại.2');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            setIsLoading(true);
            try {
                const response = await acceptMemberAPI({ token: token, otp: otpCode });
                console.log(response)
                if (response?.code === 1) {
                    toast.success('Xác thực thành công!');
                    router.push('/'); // Redirect to a welcome page or dashboard after successful verification
                } else {
                    toast.error('Mã OTP không hợp lệ, vui lòng thử lại.');
                }
            } catch (error) {
                toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error('Vui lòng nhập đầy đủ mã OTP.');
        }
    };

    return (
        <div className={styles.formOtpVerification}>
            <div className={styles.backgroundform}>
                <h2 className="text-2xl font-bold mb-4">Xác Thực OTP điện thoại</h2>
                        <form onSubmit={handleOtpSubmit} className={styles.formSubmit}>
                            <div className={styles.groupInput}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        className={styles.otpInput}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                    />
                                ))}
                            </div>
                            <button type="submit" className={`${styles.btnVerifyOtp} mt-4`}>
                                {isLoading ? (
                                    <Spin
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 24,
                                                    color: 'white',
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                ) : (
                                    'Xác Thực'
                                )}
                            </button>
                {isOtpSent ? (
                    <>
                            <button type="button" onClick={handleResendOtp} className={`${styles.btnResendOtp} mt-2`}>
                                Gửi Lại OTP
                            </button>
                    </>
                ) : (
                    <>
                        <button type="button" onClick={handleSendOtp} className={`${styles.btnSendOtp} mt-2`}>
                            Nhận OTP
                        </button>
                    </>
                )}
                        </form>
            </div>

        </div>
    );
};

export default OtpVerification;
