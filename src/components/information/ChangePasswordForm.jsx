import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCookie, checkTokenCookie } from "@/utils";
import { CHANGE_VALUE_USER } from "../../redux/slices/user/userSlice";
import { Form, Input } from "antd";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
  const [showError, setShowError] = useState(false);
  const network = useSelector((state) => state.network.ipv4Address);
  const router = useRouter();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      passOld: "",
      passNew: "",
      passAgain: "",
    },
    validationSchema: Yup.object({
      passOld: Yup.string().required("Old Password is required"),
      passNew: Yup.string()
        .required("New Password is required")
        .min(6, "New Password must be at least 6 characters"),
      passAgain: Yup.string()
        .oneOf([Yup.ref("passNew"), null], "Passwords must match")
        .required("Confirm New Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(`${network}/saveChangePassAPI`, {
          token: checkTokenCookie(),
          passOld: values?.passOld,
          passNew: values?.passNew,
          passAgain: values?.passAgain,
        });

        console.log(response);

        if (response && response?.data?.code === 0) {
          const responseInfo = await axios.post(`${network}/getInfoMemberAPI`, {
            token: checkTokenCookie(),
          });

          console.log(responseInfo);

          if (responseInfo && responseInfo?.data?.code === 0) {
            setCookie("user_login", responseInfo?.data?.data, 1);
            dispatch(CHANGE_VALUE_USER(responseInfo?.data?.data));
            toast.success("Thay đổi mật khẩu thành công", {
              autoClose: 500,
            });
            router.path("/sign-in");
          }
        }
      } catch (error) {
        toast.error("Lỗi lưu thay đổi mật khẩu");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <h1 className="text-lg my-4">Mật khẩu</h1>

      <div>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item label="Mật khẩu cũ" name="passOld">
            <Input.Password
              id="passOld"
              name="passOld"
              {...formik.getFieldProps("passOld")}
            />
          </Form.Item>
          {showError && formik.touched.passOld && formik.errors.passOld && (
            <p className="text-red-500 text-xs">{formik.errors.passOld}</p>
          )}

          <Form.Item label="Mật khẩu mới" name="passNew">
            <Input.Password
              id="passNew"
              name="passNew"
              {...formik.getFieldProps("passNew")}
            />
          </Form.Item>
          {showError && formik.touched.passNew && formik.errors.passNew && (
            <p className="text-red-500 text-xs">{formik.errors.passNew}</p>
          )}

          <Form.Item label="Xác nhận lại mật khẩu" name="passAgain">
            <Input.Password
              id="passAgain"
              name="passAgian"
              {...formik.getFieldProps("passAgain")}
            />
          </Form.Item>
          {showError && formik.touched.passAgain && formik.errors.passAgain && (
            <p className="text-red-500 text-xs">{formik.errors.passAgain}</p>
          )}
        </Form>

        <div className="flex flex-row items-center justify-end">
          <button
            type="button"
            className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
            onClick={() => setShowError(false)}>
            Hủy
          </button>
          <button
            type="button"
            className="items-center text-[15px] text-white leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ff424e] h-[36px] w-[80px] font-bold"
            onClick={() => {
              formik.handleSubmit();
              setShowError(true);
            }}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
