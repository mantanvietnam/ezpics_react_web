import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCookie, checkTokenCookie } from "@/utils";
import { CHANGE_VALUE_USER } from "../../redux/slices/user/userSlice";
import { Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ChangePhoneForm = ({ data, setData }) => {
  const [inputPhone, setInputPhone] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [showError, setShowError] = useState(false);
  const network = useSelector((state) => state.network.ipv4Address);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      phone: data.phone || "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required("Số điện thoại không được bỏ trống")
        .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa các chữ số")
        .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
        .trim(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoadingPhone(true);
      try {
        const response = await axios.post(`${network}/saveInfoUserAPI`, {
          token: checkTokenCookie(),
          phone: values?.phone,
        });

        if (response && response?.data?.code === 0) {
          const responseInfo = await axios.post(`${network}/getInfoMemberAPI`, {
            token: checkTokenCookie(),
          });

          if (responseInfo && responseInfo?.data?.code === 0) {
            setLoadingPhone(false);

            // Cập nhật dữ liệu người dùng và giao diện mà không cần reload trang
            setCookie("user_login", responseInfo?.data?.data, 1);
            dispatch(CHANGE_VALUE_USER(responseInfo?.data?.data));
            setData(responseInfo?.data?.data); // Cập nhật state dữ liệu mới

            toast.success("Thay đổi số điện thoại thành công", {
              autoClose: 500,
            });
            setInputPhone(false);
          } else {
            setLoadingPhone(false);
            toast.error(
              responseInfo?.data?.message || "Lỗi thay đổi số điện thoại"
            );
          }
        } else {
          setLoadingPhone(false);
          toast.error(
            response?.data?.message || "Lỗi lưu thay đổi số điện thoại"
          );
        }
      } catch (error) {
        setLoadingPhone(false);
        toast.error("Lỗi lưu thay đổi số điện thoại");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <h1 className="text-lg my-4">Số điện thoại</h1>
      {inputPhone ? (
        <div className="flex justify-between">
          <Input
            className="items-center text-[15px] text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ffffff] h-[36px] w-full mr-[10px] border border-[#e1e4e7]"
            type="text"
            {...formik.getFieldProps("phone")}
          />
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => {
                setInputPhone(false);
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
              {loadingPhone ? (
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
          <p>{data.phone}</p>
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => setInputPhone(true)}>
              Sửa
            </button>
          </div>
        </div>
      )}
      {showError && formik?.errors?.phone && formik?.touched?.phone && (
        <p className="text-red-500 text-xs">{formik.errors.phone}</p>
      )}
    </div>
  );
};

export default ChangePhoneForm;
