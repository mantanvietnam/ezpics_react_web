"use client";
import {
  loginByPhone,
  requestCodeForgotPasswordAPI,
  saveNewPassAPI,
} from "@/api/auth";
import {
  CHANGE_STATUS_AUTH,
  CHANGE_VALUE_TOKEN,
} from "../../../../redux/slices/auth";
import styles from "@/styles/auth/sign_in.module.scss";
import { setCookie } from "@/utils/cookie";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});
const schemaConfirm = yup.object().shape({
  phoneConfirm: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
});
const schemaNewPassword = yup.object().shape({
  verificationCode: yup
    .string()
    .min(4, "Mã xác thực mới phải có ít nhất 4 ký tự")
    .required("Mã xác thực là bắt buộc"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .required("Mật khẩu mới là bắt buộc"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu mới là bắt buộc"),
});
export default function Login() {
  const expirationHours = 3;
  const dispatch = useDispatch();
  const [ReCheck, setReCheck] = useState(false);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [checkForgotPW, setCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [codeForgotPassword, setCodeForgotPassword] = useState("");
  const [codeForgotPasswordError, setcodeForgotPasswordError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savePasswordError, setSavePasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [deviceToken, setDeviceToken] = useState("");
  useEffect(() => {
    const getDeviceToken = async () => {
      // Load the FingerprintJS agent.
      const fp = await FingerprintJS.load();

      // Get the visitor identifier when you need it.
      const result = await fp.get();

      // This is the visitor identifier:
      const visitorId = result.visitorId;
      setDeviceToken(visitorId);
    };

    getDeviceToken();
  }, []);

  function handleCheckForgot() {
    setCheck(true);
  }

  function handleRollBack() {
    setCheck(false);
    setReCheck(false);
    setCodeForgotPassword("");
  }

  function handleReCheck() {
    setReCheck(true);
  }

  function handleReCheckFalse() {
    setReCheck(false);
  }

  const handleSubmitLogin = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    setErrors("");

    try {
      // Xác thực dữ liệu
      const checkValidate = await schema.validate(
        { phone, password },
        { abortEarly: false }
      );

      if (checkValidate) {
        const response = await loginByPhone({
          phone,
          password,
          token_device: deviceToken,
          type_device: "web",
        });

        if (response?.code === 0) {
          dispatch(CHANGE_STATUS_AUTH(true));
          dispatch(CHANGE_VALUE_TOKEN(response?.info_member?.token_web));
          setCookie("token", response?.info_member?.token_web, expirationHours);
          setCookie("user_login", response?.info_member, expirationHours);

          // Điều hướng trở lại trang đích
          const redirectTo = localStorage.getItem("redirectTo") || "/";
          const openModal = localStorage.getItem("openModal") || "false";
          console.log(openModal, redirectTo);
          if (openModal === "true") {
            router.push(redirectTo);
          } else {
            router.push("/");
          }
        } else {
          setLoginError(response?.messages?.[0]?.text || "Đăng nhập thất bại.");
        }
      }
    } catch (err) {
      // Xử lý lỗi xác thực
      const validationErrors = err?.inner?.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(validationErrors || {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmForgotPassword = async (e) => {
    e.preventDefault();
    setIsConfirming(true);
    setcodeForgotPasswordError("");
    try {
      const checkValidate = await schemaConfirm.validate(
        { phoneConfirm },
        { abortEarly: false }
      );
      if (checkValidate) {
        setErrors("");
        const repon = await requestCodeForgotPasswordAPI({
          phone: phoneConfirm,
        });
        if (repon.code === 0) {
          setCodeForgotPassword(repon?.codeForgotPassword);
          handleReCheck();
          toast.success("Thay đổi mật khẩu thành công", {
            autoClose: 500,
          });
        } else {
          setCodeForgotPassword("");
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
      setIsConfirming(true);
    }
  };
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setSavePasswordError("");
    setIsSavingPassword(true);
    try {
      const checkValidate = await schemaNewPassword.validate(
        { newPassword, confirmNewPassword, verificationCode },
        { abortEarly: false }
      );
      if (checkValidate) {
        setErrors("");
        const repon = await saveNewPassAPI({
          phone: phoneConfirm,
          code: codeForgotPassword,
          passNew: newPassword,
          passAgain: confirmNewPassword,
        });
        if (repon.code === 0) {
          setIsSavingPassword(false);
          router.push("/sign-in");
        } else {
          setSavePasswordError(repon?.messages[0]?.text);
          router.push("/");
        }
      }
    } catch (err) {
      const errors = err?.inner?.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(errors);
    } finally {
      setIsSavingPassword(false);
    }
  };
  const handleLoginWithGoogle = () => {
    signIn("google");
  };
  return (
    <div className={styles.container_login}>
      <div className={styles["login-bg"]}>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40">
          <div className={styles.padding}>
            <div className="flex items-center justify-center w-full min-h-full">
              <div className={styles["login-main"]}>
                <div className={styles.title}>Ezpics - Dùng là thích! 👋</div>
                <p className={styles.description}>
                  Mời bạn đăng nhập công cụ thiết kế siêu tốc đầu tiên tại Việt
                  Nam
                </p>
                {codeForgotPassword === "" ? (
                  checkForgotPW ? (
                    <>
                      <p className={styles.label_input}>
                        Số điện thoại xác thực
                      </p>
                      <input
                        type="text"
                        value={phoneConfirm}
                        onChange={(e) => setPhoneConfirm(e.target.value)}
                      />
                      {errors?.phoneConfirm && (
                        <p className={styles.error}>{errors?.phoneConfirm}</p>
                      )}
                      {codeForgotPasswordError && (
                        <p className={styles.error}>
                          {codeForgotPasswordError}
                        </p>
                      )}
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
                                  color: "white",
                                }}
                                spin
                              />
                            }
                          />
                        ) : (
                          "Xác nhận"
                        )}
                      </button>
                      <button
                        className={styles.rollback}
                        onClick={handleRollBack}
                      >
                        <ArrowLeftOutlined className={styles.icon} />
                        <p>Quay lại</p>
                      </button>
                    </>
                  ) : (
                    <>
                      <p className={styles.label_input}>Số điện thoại</p>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitLogin(e);
                          }
                        }}
                      />
                      {errors?.phone && (
                        <p className={styles.error}>{errors?.phone}</p>
                      )}
                      <div className={styles.box_pass}>
                        <p className={styles.label_input}>Mật khẩu</p>
                        <p
                          className={styles.forgot_pass}
                          onClick={handleCheckForgot}
                        >
                          Quên mật khẩu ?
                        </p>
                      </div>
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmitLogin(e);
                            }
                          }}
                        />
                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {isPasswordVisible ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </span>
                        {errors?.password && (
                          <p className={styles.error}>{errors?.password}</p>
                        )}
                        {loginError && (
                          <p className={styles.error}>{loginError}</p>
                        )}
                      </div>
                      <button
                        type="submit"
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
                                  color: "white",
                                }}
                                spin
                              />
                            }
                          />
                        ) : (
                          "Đăng nhập"
                        )}
                      </button>
                      <p className={styles.or}>Hoặc</p>
                      <button
                        className={styles.register}
                        onClick={handleLoginWithGoogle}
                      >
                        Đăng nhập bằng Google
                      </button>
                      <p className={styles.option_regis}>
                        Bạn chưa có tài khoản ? -{" "}
                        <Link href={"/sign-up"}>Đăng ký</Link>
                      </p>
                    </>
                  )
                ) : ReCheck ? (
                  <>
                    <p className={styles.label_input}>Mã xác nhận trong Zalo</p>
                    <input
                      type="text"
                      value={phoneConfirm}
                      onChange={(e) => setPhoneConfirm(e.target.value)}
                      className="text-gray-500 bg-gray-200 border-gray-300 cursor-not-allowed"
                      disabled
                    />
                    <p className={styles.label_input}>Nhập mã xác thực</p>
                    <input
                      type="password"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    {errors?.verificationCode && (
                      <p className={styles.error}>{errors?.verificationCode}</p>
                    )}
                    <p className={styles.label_input}>Mật khẩu mới</p>
                    <div style={{ position: "relative" }}>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        {isPasswordVisible ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </span>
                    </div>
                    {errors?.newPassword && (
                      <p className={styles.error}>{errors?.newPassword}</p>
                    )}
                    <p className={styles.label_input}>Nhập lại mật khẩu mới</p>
                    <div style={{ position: "relative" }}>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        {isPasswordVisible ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </span>
                    </div>
                    {errors?.confirmNewPassword && (
                      <p className={styles.error}>
                        {errors?.confirmNewPassword}
                      </p>
                    )}
                    {savePasswordError && (
                      <p className={styles.error}>{savePasswordError}</p>
                    )}
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
                                color: "white",
                              }}
                              spin
                            />
                          }
                        />
                      ) : (
                        "Xác nhận"
                      )}
                    </button>
                    <button
                      className={styles.rollback}
                      onClick={handleRollBack}
                    >
                      <ArrowLeftOutlined className={styles.icon} />
                      <p>Quay lại</p>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
