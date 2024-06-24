import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCookie, checkTokenCookie } from "@/utils";
import { CHANGE_VALUE_USER } from "@/redux/slices/infoUser";
import { Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ChangeMailForm = ({ data, setData }) => {
  const [inputMail, setInputMail] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingMail, setLoadingMail] = useState(false);
  const network = useSelector((state) => state.ipv4.network);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: data.email || "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Không được bỏ trống")
        .email("Không phải định dạng email")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Không phải định dạng email")
        .trim(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoadingMail(true);
      try {
        const response = await axios.post(`${network}/saveInfoUserAPI`, {
          token: checkTokenCookie(),
          email: values?.email,
        });

        if (response && response?.data?.code === 0) {
          const responseInfo = await axios.post(`${network}/getInfoMemberAPI`, {
            token: checkTokenCookie(),
          });

          if (responseInfo && responseInfo?.data?.code === 0) {
            setLoadingMail(false);

            // Cập nhật dữ liệu người dùng và giao diện mà không cần reload trang
            setCookie("user_login", responseInfo?.data?.data, 1);
            dispatch(CHANGE_VALUE_USER(responseInfo?.data?.data));
            setData(responseInfo?.data?.data); // Cập nhật state dữ liệu mới
            window.location.reload();

            toast.success("Thay đổi email thành công");
            setInputMail(false);
          } else {
            setLoadingName(false);
            toast.error(responseInfo?.data?.message || "Lỗi thay đổi email");
          }
        } else {
          setLoadingName(false);
          toast.error(response?.data?.message || "Lỗi lưu thay đổi email");
        }
      } catch (error) {
        setLoadingName(false);
        toast.error("Lỗi lưu thay đổi email");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <h1 className="text-lg my-4">Email</h1>
      {inputMail ? (
        <div className="flex justify-between">
          <Input
            className="items-center text-[15px] text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ffffff] h-[36px] w-full mr-[10px] border border-[#e1e4e7]"
            type="email"
            {...formik.getFieldProps("email")}
          />
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => {
                setInputMail(false);
                setShowError(false); // Ẩn lỗi khi hủy bỏ
              }}>
              Hủy
            </button>
            <button
              type="button"
              className="items-center text-[15px] text-white leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ff424e] h-[36px] w-[80px] font-bold"
              onClick={() => {
                formik.handleSubmit();
                setShowError(true); // Hiển thị lỗi khi nhấn Lưu
              }}>
              {loadingMail ? (
                <span>
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 24,
                          color: "#fff",
                        }}
                        spin
                      />
                    }
                  />
                </span>
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p>{data.email}</p>
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => setInputMail(true)}>
              Sửa
            </button>
          </div>
        </div>
      )}
      {showError && formik?.errors?.email && formik?.touched?.email && (
        <p className="text-red-500 text-xs">{formik.errors.email}</p>
      )}
    </div>
  );
};

export default ChangeMailForm;
