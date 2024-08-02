import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCookie, checkTokenCookie } from "@/utils";
import { CHANGE_VALUE_USER } from "../../redux/slices/user/userSlice";
import { Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ChangeNameForm = ({ data, setData }) => {
  const [inputName, setInputName] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [showError, setShowError] = useState(false);
  const network = useSelector((state) => state.network.ipv4Address);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Không được bỏ trống")
        .matches(
          /^[A-ZÀ-Ẫ][a-zà-ỹ]*(\s[A-ZÀ-Ẫ][a-zà-ỹ]*)*$/,
          "Tên phải viết hoa chữ cái đầu mỗi từ và không có khoảng trắng ở đầu và cuối, và phải bao gồm các ký tự tiếng Việt hợp lệ"
        )
        .trim()
        .min(6, "Ít nhất phải có 6 ký tự")
        .max(30, "Tên không được vượt quá 30 ký tự"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoadingName(true);
      try {
        const response = await axios.post(`${network}/saveInfoUserAPI`, {
          token: checkTokenCookie(),
          name: values?.name,
        });

        if (response && response?.data?.code === 0) {
          const responseInfo = await axios.post(`${network}/getInfoMemberAPI`, {
            token: checkTokenCookie(),
          });

          if (responseInfo && responseInfo?.data?.code === 0) {
            setLoadingName(false);

            // Cập nhật dữ liệu người dùng và giao diện mà không cần reload trang
            setCookie("user_login", responseInfo?.data?.data, 1);
            dispatch(CHANGE_VALUE_USER(responseInfo?.data?.data));
            setData(responseInfo?.data?.data); // Cập nhật state dữ liệu mới
            window.location.reload();

            toast.success("Thay đổi tên thành công");
            setInputName(false);
          } else {
            setLoadingName(false);
            toast.error(responseInfo?.data?.message || "Lỗi thay đổi tên");
          }
        } else {
          setLoadingName(false);
          toast.error(response?.data?.message || "Lỗi lưu thay đổi tên");
        }
      } catch (error) {
        setLoadingName(false);
        toast.error("Lỗi lưu thay đổi tên");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <h1 className="text-lg my-4">Tên</h1>
      {inputName ? (
        <div className="flex justify-between">
          <Input
            className="items-center text-[15px] text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ffffff] h-[36px] w-full mr-[10px] border border-[#e1e4e7]"
            type="text"
            {...formik.getFieldProps("name")}
          />
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => {
                setInputName(false);
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
              {loadingName ? (
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
          <p>{data.name}</p>
          <div className="flex flex-row items-center">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => setInputName(true)}>
              Sửa
            </button>
          </div>
        </div>
      )}
      {showError && formik?.errors?.name && formik?.touched?.name && (
        <p className="text-red-500 text-xs">{formik.errors.name}</p>
      )}
    </div>
  );
};

export default ChangeNameForm;
