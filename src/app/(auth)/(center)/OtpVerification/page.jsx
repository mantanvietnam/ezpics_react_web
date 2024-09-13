"use client";
import React, { useEffect, useState, useContext } from "react";
// import styles from '../../../../styles/auth/otp_verification.module.scss';
import styles from "./otp_verification.module.scss";
import { acceptMemberAPI, SendOtp } from "@/api/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { checkTokenCookie, getCookie } from "@/utils";
import { useSession } from "next-auth/react";
import { clearAllCookies } from "../../../../utils/cookie";
import { getInfoMemberAPI } from "@/api/user";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [countdown, setCountdown] = useState(60); // Đếm ngược 60 giây
  // const { data: session } = useSession();
  const router = useRouter();
  const token = checkTokenCookie();
  // Lấy data user
  // let dataInforUser;
  // if (getCookie("user_login")) {
  //   dataInforUser = JSON.parse(getCookie("user_login"));
  // } else if (session?.user_login) {
  //   dataInforUser = session?.user_login;
  // } else {
  //   dataInforUser = null;
  // }

  const [dataUser, setDataUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInfoMemberAPI({
          token: checkTokenCookie(),
        });
        setDataUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await SendOtp({ phone: dataUser?.phone }); // Gọi hàm sendOtp để nhận lại mã OTP mới
      if (response?.code == 0) {
        toast.success("Mã OTP đã được gửi lại !", {
          autoClose: 500,
        });
        setOtp(["", "", "", "", "", ""]); // Reset lại các ô nhập OTP
        setIsOtpSent(true); // Đã gửi mã OTP thành công
        document.getElementById("otp-input-0").focus(); // Focus vào ô nhập OTP đầu tiên
      } else {
        toast.error("Không thể gửi lại mã OTP, vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại....");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let timer;
    if (isOtpSent) {
      setCanResendOtp(false);
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await SendOtp({ phone: dataUser?.phone }); // Gọi hàm sendOtp để nhận mã OTP
      if (response?.code == 0) {
        toast.success("Đã gửi mã OTP!", {
          autoClose: 500,
        });
        document.getElementById("otp-input-0").focus(); // Focus vào ô nhập OTP đầu tiên
        setIsOtpSent(true); // Đã gửi mã OTP thành công
        setCanResendOtp(false); // Đặt lại để chờ 1 phút
      } else {
        toast.error("Không thể gửi mã OTP, vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.2");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      setIsLoading(true);
      try {
        const response = await acceptMemberAPI({ token: token, otp: otpCode });
        if (response?.code === 1) {
          toast.success("Xác thực thành công!", {
            autoClose: 500,
          });
          router.push("/"); // Redirect to a welcome page or dashboard after successful verification
        } else {
          toast.error("Mã OTP không hợp lệ, vui lòng thử lại.");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ mã OTP.");
    }
  };

  const handleBack = () => {
    clearAllCookies();
    router.push("/");
  };
  return (
    <div className={styles.formOtpVerification}>
      <div className={styles.backgroundform}>
        <Button
          type="primary"
          className="left-[-185px] top-[-34px]"
          danger
          size="small"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}></Button>
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
                      color: "white",
                    }}
                    spin
                  />
                }
              />
            ) : (
              "Xác Thực"
            )}
          </button>
          {isOtpSent ? (
            canResendOtp ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className={`${styles.btnResendOtp} mt-2`}>
                Gửi Lại OTP
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.btnResendOtp} mt-2`}
                disabled>
                Gửi Lại OTP ({countdown}s)
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              className={`${styles.btnSendOtp} mt-2`}>
              Nhận OTP
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
