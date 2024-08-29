/* eslint-disable @next/next/no-img-element */
"use client";
import { getInfoMemberAPI } from "@/api/user";
import {
  checkAvailableLogin,
  checkTokenCookie,
  setCookie,
  getCookie,
} from "@/utils";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import {
  CHANGE_VALUE_USER,
  DELETE_ALL_VALUES,
} from "../../../redux/slices/user/userSlice";
import axios from "axios";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import ChangeNameForm from "@/components/information/ChangeNameForm";
import ChangeMailForm from "@/components/information/ChangeMailForm";
// import ChangePhoneForm from "@/components/information/ChangePhoneForm";
// import ChangePasswordForm from "@/components/information/ChangePasswordForm";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network.ipv4Address);
  const router = useRouter();
  const isAuthenticated = checkAvailableLogin();

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      redirect("/sign-in");
    }
  }, [isAuthenticated]);

  const { data: session } = useSession();

  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getInfoMemberAPI({
          token: checkTokenCookie(),
        });

        if (response && response.code === 0) {
          setData(response?.data);
        } else {
          // Handle cases where the response code is not 0
          console.error("Failed to fetch data:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dataInforUser) {
      getData();
    } else {
      setLoading(false);
    }
  }, [setData]);

  console.log(data);
  console.log(dataInforUser);

  // Btn xem anh hien tai
  const [modalImage, setModalImage] = useState(false);
  const handleCloseModalFreeExtend = () => {
    setModalImage(false);
  };

  //Thay doi anh
  const [loadingImage, setLoadingImage] = useState(false);
  const inputFileRef = useRef(null);
  const handleRemoveBackground = () => {
    inputFileRef.current?.click();
  };

  const handleDropFiles = async (files) => {
    // Đặt trạng thái đang tải lên là true
    setLoadingImage(true);

    // Lấy tệp đầu tiên từ danh sách các tệp
    const file = files[0];

    // Tạo URL tạm thời cho tệp
    var url = URL.createObjectURL(file);

    // Kiểm tra định dạng tệp
    if (!/(png|jpg|jpeg)$/i.test(file.name)) {
      // Hiển thị thông báo lỗi nếu định dạng không hợp lệ
      toast.error("Chỉ chấp nhận file png, jpg hoặc jpeg");

      // Đặt lại trạng thái đang tải lên là false
      setLoadingImage(false);

      // Kết thúc hàm
      return;
    } else {
      // Định nghĩa các header cho yêu cầu
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "multipart/form-data",
      };

      // Cấu hình cho yêu cầu axios
      const config = {
        headers: headers,
      };

      // Tạo một đối tượng FormData để gửi dữ liệu tệp
      const formData = new FormData();

      // Thêm tệp vào FormData
      formData.append("avatar", file);

      // Thêm token vào FormData
      formData.append("token", checkTokenCookie());

      // Gửi yêu cầu POST để tải lên tệp và nhận phản hồi từ máy chủ
      const response = await axios.post(
        `${network}/saveInfoUserAPI`,
        formData,
        config
      );

      // Kiểm tra phản hồi từ máy chủ
      if (response && response.data) {
        const responseInfoApi = await axios.post(
          `${network}/getInfoMemberAPI`,
          {
            token: checkTokenCookie(),
          }
        );

        if (responseInfoApi && responseInfoApi.data.code === 0) {
          setLoadingImage(false);

          //   window.location.reload();
          console.log(responseInfoApi.data);
          setCookie("user_login", responseInfoApi.data.data, 1);
          dispatch(CHANGE_VALUE_USER(responseInfoApi.data.data));
          setData(responseInfoApi?.data?.data);
          window.location.reload();
        }
      }
    }
  };

  const handleFileInput = (e) => {
    handleDropFiles(e.target.files);
  };

  // Delete account
  const [modalDelete, setModalDelete] = useState(false);
  const handleCloseModalDelete = () => {
    setModalDelete(false);
  };

  function deleteCookie(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const handleDeleteAccount = async () => {
    const response = await axios.post(`${network}/lockAccountAPI`, {
      token: checkTokenCookie(),
    });
    if (response && response.data) {
      const response = await axios.post(`${network}/getInfoMemberAPI`, {
        token: checkTokenCookie(),
      });
      if (response && response.data.code === 0) {
        deleteCookie("user_login");
        dispatch(DELETE_ALL_VALUES());
        router.path("/", { replace: true });
      }
    }
  };

  //Modal password
  const [modalPassword, setModalPassword] = useState(false);
  const handleCloseModalPassword = () => {
    setModalPassword(false);
  };

  const ChangePasswordForm = ({ data, setData }) => {
    const [showError, setShowError] = useState(false);
    const router = useRouter();

    const formik = useFormik({
      initialValues: {
        passOld: "",
        passNew: "",
        passAgain: "",
      },
      validationSchema: Yup.object({
        passOld: Yup.string().required("Mật khẩu cũ bị trống"),
        passNew: Yup.string()
          .required("Mật khẩu mới bị trống")
          .min(6, "Mật khẩu mới ít nhất 6 kí tự"),
        passAgain: Yup.string()
          .oneOf([Yup.ref("passNew"), null], "Mật khẩu không trùng nhau")
          .required("Xác nhận mật khẩu mới bị trống"),
      }),
      onSubmit: async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            `https://apis.ezpics.vn/apis/saveChangePassAPI`,
            {
              token: checkTokenCookie(),
              passOld: values.passOld,
              passNew: values.passNew,
              passAgain: values.passAgain,
            }
          );

          console.log(response);
          if (response.data.code === 0) {
            toast.success("Thay đổi mật khẩu thành công", {
              autoClose: 500,
            });
            router.push("/sign-in");
            console.log("push");
          } else {
            toast.error(response.data.messages[0].text);
          }
        } catch (error) {
          toast.error("Lỗi lưu thay đổi mật khẩu!");
        }
        setSubmitting(false);
      },
    });

    return (
      <div>
        <h1 className="text-lg my-4">Mật khẩu</h1>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 24 }}
          onFinish={formik.handleSubmit} // Ensure the form is submitted via Formik
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="passOld"
            help={formik.touched.passOld && formik.errors.passOld}>
            <Input.Password
              id="passOld"
              name="passOld"
              value={formik.values.passOld}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="passNew"
            help={formik.touched.passNew && formik.errors.passNew}>
            <Input.Password
              id="passNew"
              name="passNew"
              value={formik.values.passNew}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận lại mật khẩu"
            name="passAgain"
            help={formik.touched.passAgain && formik.errors.passAgain}>
            <Input.Password
              id="passAgain"
              name="passAgain"
              value={formik.values.passAgain}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          <div className="flex flex-row items-center justify-end">
            <button
              type="button"
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => {
                setShowError(false);
                handleCloseModalPassword();
              }}>
              Hủy
            </button>
            <button
              type="submit"
              className="items-center text-[15px] text-white leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ff424e] h-[36px] w-[80px] font-bold">
              Lưu
            </button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <div className="w-full pt-[3%] pl-[5%]">
      <div className="w-[70%]">
        <h1 className="text-xl font-bold">Tài khoản của bạn</h1>
        <div className="border-b-2 py-[4%]">
          <h1 className="text-lg my-4">Ảnh hồ sơ</h1>
          <div className="flex justify-between items-center">
            <img
              src={data?.avatar}
              alt=""
              className="w-[80px] h-[80px] rounded-[50px] object-cover"
            />
            <div className="">
              <button
                className="text-base h-8 mr-4 font-bold"
                onClick={() => setModalImage(true)}>
                Xem ảnh hiện tại
              </button>
              <button
                className="items-center text-base px-3 bg-[#e1e4e7] h-8 w-32 font-semibold"
                onClick={() => handleRemoveBackground()}>
                {loadingImage ? (
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
                  "Thay đổi ảnh"
                )}
              </button>
              <input
                onChange={handleFileInput}
                type="file"
                id="file"
                ref={inputFileRef}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="border-b-2 py-[4%]">
          <ChangeNameForm data={data} setData={setData} />
        </div>
        <div className="border-b-2 py-[4%]">
          <ChangeMailForm data={data} setData={setData} />
        </div>
        {/* <div className="border-b-2 py-[4%]">
          <ChangePhoneForm data={data} setData={setData} />
        </div> */}
        <div className="border-b-2 py-[4%]">
          <h1 className="text-lg my-4">Mật khẩu</h1>
          <div className="flex justify-between items-center">
            <p>*********</p>
            <div className="flex flex-row items-center">
              <button
                type="button"
                className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
                onClick={() => setModalPassword(true)}>
                Sửa
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="py-[4%]">
          <h1 className="text-lg my-4">Xóa tài khoản</h1>
          <div className="flex justify-between  items-center">
            <p>
              Một khi bạn xóa tài khoản, bạn sẽ không thể quay lại. Xin hãy chắc
              chắn.
            </p>
            <button
              className="flex items-center text-red-500 text-sm leading-[22px] normal-case px-2 h-9 w-30 border border-red-500 bg-white"
              onClick={() => setModalDelete(true)}>
              Xóa tài khoản
            </button>
          </div>
        </div>

        {/* Modal password */}
        <Modal
          open={modalPassword}
          onCancel={handleCloseModalPassword}
          footer={null}
          width={"40%"}>
          <div>
            <ChangePasswordForm data={dataInforUser} setData={setData} />
          </div>
        </Modal>

        {/* Modal xem ảnh */}
        <Modal
          open={modalImage}
          onCancel={handleCloseModalFreeExtend}
          footer={null}>
          <div>
            <img
              src={data?.avatar}
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Modal>

        {/* Modal delete account */}
        <Modal
          open={modalDelete}
          onCancel={handleCloseModalDelete}
          footer={null}>
          <p className="text-lg py-[5%]">
            Bạn chắc chắn muốn xóa tài khoản này ?
          </p>
          <div className="flex justify-end">
            <button
              className="items-center text-[#0d1216] leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#e1e4e7] h-[36px] w-[80px] font-bold mr-[10px]"
              onClick={() => handleCloseModalDelete()}>
              Hủy
            </button>
            <button
              className="items-center text-[15px] text-white leading-[22px] normal-case pl-[10px] pr-[10px] bg-[#ff424e] h-[36px] w-[80px] font-bold"
              onClick={() => handleDeleteAccount()}>
              Xóa
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Page;
