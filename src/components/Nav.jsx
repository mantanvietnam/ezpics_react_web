/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/images/index2";
import ModalUpPro from "./ModalUpPro";
import ModalUpDesigner from "./ModalUpDesigner";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import ModalRecharge from "./ModelRecharge";
import { checkAvailableLogin, getCookie, checkTokenCookie } from "@/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const Nav = ({
  isOpen,
  closeNavbar,
  activeItem,
  setActiveItem,
  handleNavItem,
  activeFunc,
  setActiveFunc,
  hanldeFuncItem,
}) => {
  const router = useRouter();
  const [openPro, setOpenPro] = useState(false);
  const [openDesigner, setOpenDesigner] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);

  const handleCancelPro = () => {
    setOpenPro(false);
  };
  const handleCancelDesigner = () => {
    setOpenDesigner(false);
  };
  // Lấy data user
  const { data: session } = useSession();
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  // Determine if the user is a Pro member
  const isProMember = dataInforUser?.member_pro === 1;

  const handleCancelRecharge = () => {
    setOpenRecharge(false);
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const isAuthenticated = checkAvailableLogin();
  // console.log(isAuthenticated);

  const navItems = useMemo(
    () => [
      // { href: "/", label: "Trang chủ", icon: images.home },
      { href: "/remove", label: "Xóa nền", icon: images.remove },
      {
        href: "/image-compression",
        label: "Nén hình ảnh",
        icon: images.compression,
      },
      {
        href: "/image-resize",
        label: "Thay đổi kích thước",
        icon: images.changeSize,
      },
      // { href: "#", label: "Tạo khung avatar", icon: images.frameAvatar },
    ],
    []
  );

  const userFuncs = useMemo(
    () => [
      { href: "/project", label: "Danh mục", icon: images.category },
      {
        href: "/your-design/purchase-form",
        label: "Thiết kế của bạn",
        icon: images.design,
      },
      { href: "/ordered", label: "Order mẫu thiết kế", icon: images.order },
      {
        href: "/your-collection/purchase-collection",
        label: "Bộ sưu tập của bạn",
        icon: images.collection2,
      },
      {
        href: "/transaction/table-1",
        label: "Tổng quan giao dịch",
        icon: images.transaction,
      },
      {
        href: "/",
        label: `${isProMember ? "Gia hạn bản PRO" : "Dùng thử bản PRO"}`,
        icon: images.renew,
        onClick: () => setOpenPro(true),
      },
      {
        href: "/",
        label: "Đăng kí Designer",
        icon: images.renew,
        onClick: () => setOpenDesigner(true),
      },
    ],
    [isProMember]
  );

  const pathname = usePathname();

  useEffect(() => {
    const navItemIndex = navItems.findIndex((item) => item.href === pathname);
    const funcItemIndex = userFuncs.findIndex((item) => item.href === pathname);

    if (navItemIndex !== -1) {
      setActiveItem(navItemIndex);
      setActiveFunc(null);
    } else if (funcItemIndex !== -1) {
      setActiveFunc(funcItemIndex);
      setActiveItem(null);
    }
  }, [navItems, pathname, userFuncs]);

  const [openModalCreatingInvitation, setOpenModalCreatingInvitation] =
    useState(false);

  const handleCanCelModalCreatingInvitation = () => {
    setOpenModalCreatingInvitation(false);
    setSelectedFile(false);
    document.body.style.overflowY = "auto";
  };

  const handleAddNewInvitation = () => {
    if (isAuthenticated) {
      setOpenModalCreatingInvitation(!openModalCreatingInvitation);
    } else {
      router.push("/sign-in");
    }
  };

  //Luu url file
  const [loadingButtonModalCreate, setLoadingButtonModalCreate] =
    useState(false);

  const [urlSelectedFile, setUrlSelectedFile] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files.length > 0) {
      const file = files[0];

      // Lưu trữ thông tin về tệp tin trong trạng thái của component
      setSelectedFile(file);
      setUrlSelectedFile(URL.createObjectURL(file));
      // Bạn có thể thực hiện các xử lý khác tại đây
    }
  };

  //Button tao khung
  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    setLoadingButtonModalCreate(true);

    try {
      if (selectedFile) {
        const response = await axios.post(
          `https://apis.ezpics.vn/apis/createProductAPI`,
          {
            token: checkTokenCookie(),
            type: "user_series",
            category_id: 0,
            sale_price: 0,
            name: `Mẫu thiệp mời ${Math.floor(Math.random() * 100001)}`,
            background: selectedFile,
            type_editor: 1,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response && response.data && response.data.code === 0) {
          setLoadingButtonModalCreate(false);
          document.body.style.overflowY = "auto";
          toast.success("Tạo khung avatar thành công, xin chờ giây lát", {
            autoClose: 500,
          });

          router.push(`/invitation/${response.data.product_id}`);
        } else {
          // Handle unexpected response structure or error code
          console.error("Unexpected response:", response);
          setLoadingButtonModalCreate(false);
        }
      } else {
        console.log("Không thấy ảnh");
        setLoadingButtonModalCreate(false);
      }
    } catch (error) {
      console.error("Error creating custom product:", error);
      // Handle error (e.g., show error message to the user)
      setLoadingButtonModalCreate(false);
    }
  };

  return (
    <div
      className={`fixed left-0 top-[var(--header-height)] h-[calc(100%-64px)] bg-white border-r border-gray-300 w-[250px] p-5 box-border flex flex-col gap-2 z-50 transition-transform duration-300 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {isAuthenticated ? (
        <div className="py-2 font-bold text-gray-800 no-underline border-b border-gray-300 cursor-pointer">
          <div className="relative flex items-center justify-around">
            <div className="w-10 h-10 m-2 overflow-hidden rounded-full">
              <Image
                src={dataInforUser?.avatar}
                alt=""
                width={40}
                height={40}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            {isProMember && (
              <Image
                src="/images/crown.png"
                alt=""
                width={18}
                height={18}
                className="absolute bottom-[10%] left-[20%]"
              />
            )}
            <div>
              <p>{dataInforUser?.name}</p>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.balance}
                  alt=""
                  width={20}
                  height={20}
                  className="pr-1 rounded-full"
                />{" "}
                <p>: {VND.format(dataInforUser?.account_balance)}</p>
              </div>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.eCoin}
                  alt=""
                  width={20}
                  height={20}
                  className="pr-1 rounded-full"
                />{" "}
                <p>: {dataInforUser?.ecoin} eCoin</p>
              </div>
            </div>
          </div>
          <div className="w-full mt-3" onClick={() => setOpenRecharge(true)}>
            <button className="flex items-center justify-center w-full h-12 text-sm font-bold text-center text-white transition duration-300 ease-in-out transform rounded-lg shadow-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 hover:scale-105">
              <p className="flex items-center space-x-2">
                <img src="/images/crown.png" alt="" className="w-5 h-5" />
                <span className="text-lg">Nạp tiền</span>
              </p>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Link
            href={"/sign-in"}
            className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer"
          >
            <UserOutlined className="text-2xl p-[10px] bg-gray-300 rounded-full" />
            <p>Đăng nhập</p>
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-[15px]">
        {navItems.map((navItem, index) => (
          <Link
            key={index}
            href={navItem.href}
            className={`rounded-lg ${activeItem === index && "bg-gray-300"}`}
            onClick={() => handleNavItem(index)}
          >
            <div className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer">
              <Image
                src={navItem.icon}
                alt=""
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              {navItem.label}
            </div>
          </Link>
        ))}
        <div className={`rounded-lg`} onClick={() => handleAddNewInvitation()}>
          <div className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer">
            <Image
              src={images.frameAvatar}
              alt=""
              width={20}
              height={20}
              className="w-[20px] h-[20px]"
            />
            Tạo khung avatar
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col gap-[15px] border-t border-gray-300 pt-1.5">
          {userFuncs.map((userFunc, index) => (
            <Link
              key={index}
              href={userFunc.href}
              className={`rounded-lg ${activeFunc === index && "bg-gray-300"}`}
              onClick={() => hanldeFuncItem(index)}
            >
              <div
                className="flex items-center gap-[10px] no-underline text-gray-800 p-2 cursor-pointer"
                onClick={userFunc.onClick}
              >
                <Image
                  src={userFunc.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
                {userFunc.label}
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <ModalUpPro
        isProMember={isProMember}
        open={openPro}
        handleCancel={handleCancelPro}
      />
      <ModalUpDesigner
        open={openDesigner}
        handleCancel={handleCancelDesigner}
      />
      <ModalRecharge open={openRecharge} handleCancel={handleCancelRecharge} />

      <Modal
        open={openModalCreatingInvitation}
        onCancel={handleCanCelModalCreatingInvitation}
        footer={null}
        width={"30%"}
      >
        <div className="bg-modal-creating rounded-lg overflow-hidden bg-no-repeat bg-cover w-full h-[180px]">
          <h1 className="text-2xl font-bold text-[#735400] ml-[14px] mt-10">
            Bắt đầu tạo mẫu thiệp mời
          </h1>
          <br></br>
          <h1 style={{ fontSize: 15 }} className="ml-[22px]">
            Hãy điền đầy đủ thông tin trước khi tạo nhé
          </h1>
        </div>
        {selectedFile ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <img
              src={urlSelectedFile}
              alt=""
              style={{
                width: 200,
                height: "auto",
                alignSelf: "center",
              }}
            />
          </div>
        ) : (
          <div className="relative flex flex-col pt-4">
            <h1 className="text-xl text-[#606365]">Ảnh nền</h1>
            <form
              id="file-upload-form"
              className="block clear-both w-full mx-auto max-w-600"
              style={{ marginTop: 40 }}
            >
              <input
                className="hidden"
                id="file-upload"
                type="file"
                name="fileUpload"
                accept="image/*"
                onChange={handleFileChange}
              />

              <label
                className="float-left clear-both w-full px-6 py-8 text-center transition-all bg-white border rounded-lg select-none"
                htmlFor="file-upload"
                id="file-drag"
                style={{ height: 200, cursor: "pointer" }}
              >
                <img id="file-image" src="#" alt="Preview" className="hidden" />
                <div id="">
                  <img
                    src="/images/direct-download.png"
                    alt=""
                    style={{
                      width: 30,
                      height: 30,
                      alignSelf: "center",
                      margin: "0 auto",
                      marginBottom: "2%",
                    }}
                  />
                  <div id="notimage" className="hidden">
                    Hãy chọn ảnh
                  </div>
                  <span id="file-upload-btn" className="">
                    {selectedFile === null ? "Chọn ảnh" : "Chọn lại"}
                  </span>
                </div>
                <div id="response" className="hidden">
                  <div id="messages"></div>
                  <progress className="progress" id="file-progress" value="0">
                    <span>0</span>%
                  </progress>
                </div>
              </label>
            </form>
          </div>
        )}
        <div>
          {selectedFile !== null ? (
            <div>
              <button
                className="w-full p-2 mt-3 text-lg font-medium text-white bg-red-500 border-0 rounded-md font-inherit"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => handleCreateInvitation(e)}
              >
                {loadingButtonModalCreate ? (
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
                  "Bắt đầu tạo mẫu"
                )}
              </button>
            </div>
          ) : (
            <div>
              <button
                className="w-full p-2 mt-3 text-lg font-medium text-white bg-red-500 border-0 rounded-md font-inherit"
                style={{ backgroundColor: "rgba(255, 66, 78,0.3)" }}
                disabled
              >
                Bắt đầu tạo mẫu
              </button>
            </div>
          )}
        </div>
        <div className="px-4 text-sm text-center text-gray-500">
          <p>
            Nếu bạn chưa có thông tin, hãy tham khảo
            <a href="#" className="block text-purple-600 no-underline">
              Mẫu thiết kế có sẵn
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Nav;
