/* eslint-disable @next/next/no-img-element */
"use client";
import {
  BarsOutlined,
  BellOutlined,
  DownloadOutlined,
  SettingOutlined,
  UserOutlined,
  EllipsisOutlined,
  DownOutlined,
  RightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Divider, Dropdown, Modal, Space, Spin, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import "@/styles/home/header.scss";
import { useRouter } from "next/navigation";
import images, { designIcon, contactInfo } from "../../public/images/index2";
import { useEffect, useRef, useState } from "react";
import { checkAvailableLogin, checkTokenCookie, getCookie } from "@/utils";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { DELETE_ALL_VALUES } from "../redux/slices/user/userSlice";
import { logoutService } from "@/api/auth";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import useCheckInternet from "@/hooks/useCheckInternet ";
import axios from "axios";

const Header = ({ toggleNavbar, activeHeader, handleHeaderItem }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isAuth = checkAvailableLogin();
  const [dataInforUsercheck, setdataInforUsercheck] = useState(null);
  const [modalLogoutDevice, setModalLogoutDevice] = useState(false);
  const [token, setToken] = useState();
  const cookie = checkTokenCookie();
  // check online
  const isOnline = useCheckInternet();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isOnline]);
  // check sign-double
  const handleLogoutDevice = () => {
    document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    dispatch(DELETE_ALL_VALUES());
    setModalLogoutDevice(false);
  };
  useEffect(() => {
    const fetchDataUsercheck = async () => {
      try {
        const response = await axios.post(
          "https://apis.ezpics.vn/apis/getInfoMemberAPI",
          {
            token: token,
          }
        );
        if (response?.data?.code == 3) {
          setModalLogoutDevice(true);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchDataUsercheck();
    const intervalId = setInterval(fetchDataUsercheck, 45000);
    return () => clearInterval(intervalId);
  }, [token]);

  //  check OTP
  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await axios.post(
          "https://apis.ezpics.vn/apis/getInfoMemberAPI",
          {
            token: cookie,
          }
        );
        if (response) {
          setdataInforUsercheck(response?.data?.data);
          if (response?.data?.data?.otp != null) {
            toast.warning(
              "Tài khoản chưa được xác thực, Bạn sẽ được chuyển hướng sang trang xác thực!"
            );
            router.push("/OtpVerification");
          }
        } else {
          console.error("Invalid response format for categories");
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchDataUser();
  }, [cookie, router]);
  // lấy token 2 bên đăng nhập
  useEffect(() => {
    const fetchDataFromStorage = () => {
      let userToken = null;
      if (getCookie("user_login")) {
        userToken = checkTokenCookie();
      } else if (session?.user_login) {
        userToken = session.token;
      }
      setToken(userToken); // Thiết lập token
    };
    // Gọi fetchDataFromStorage khi component được gắn vào
    fetchDataFromStorage();
  }, [session?.token, session?.user_login]);
  // Lấy data user
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }

  //Lấy danh sách mẫu thiết kế
  const [dataSizeBox, setDataSizeBox] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `https://apis.ezpics.vn/apis/getSizeProductAPI`
        );
        if (response && response.data) {
          setDataSizeBox(response.data);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    getData();
  }, []);

  // console.log(dataSizeBox);

  //Ẩn hiện popup mẫu thiết kế
  const [creatingBucket, setCreatingBucket] = useState(false);

  //Check auth khi ấn btn tạo thiết kế
  const handleAddNewDesign = () => {
    if (isAuth) {
      setCreatingBucket(!creatingBucket);
    } else {
      router.push("/sign-in");
    }
  };

  //Chon file tai len
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

  //Popup modal btn cỡ tùy chỉnh
  const [openModalCreatingInvitation, setOpenModalCreatingInvitation] =
    useState(false);

  const handleShowModalCreatingInvitation = () => {
    setOpenModalCreatingInvitation(true);
  };
  const handleCanCelModalCreatingInvitation = () => {
    setOpenModalCreatingInvitation(false);
    setSelectedFile(false);
    document.body.style.overflowY = "auto";
  };

  //Check auth khi ấn btn tạo thiết kế
  const handleAddNewInvitation = () => {
    if (isAuth) {
      setOpenModalCreatingInvitation(!openModalCreatingInvitation);
    } else {
      router.push("/sign-in");
    }
  };

  //Popup modal btn in hàng loạt
  const [openModalCreatingPrint, setOpenModalCreatingPrint] = useState(false);

  const handleShowModalCreatingPrint = () => {
    setOpenModalCreatingPrint(true);
  };
  const handleCanCelModalCreatingPrint = () => {
    setOpenModalCreatingPrint(false);
    setSelectedFile(false);
    document.body.style.overflowY = "auto";
  };

  //Popup modal btn cỡ tùy chỉnh
  const [openModalCreating, setOpenModalCreating] = useState(false);

  const handleShowModalCreating = () => {
    setOpenModalCreating(true);
  };
  const handleCanCelModalCreating = () => {
    setOpenModalCreating(false);
    setSelectedFile(false);
    document.body.style.overflowY = "auto";
  };

  //Loading spin
  const [loadingButtonModalCreate, setLoadingButtonModalCreate] =
    useState(false);

  //Luu url file
  const [urlSelectedFile, setUrlSelectedFile] = useState("");

  //Button tạo thiết kế tùy chỉnh
  const handleCreateCustom = async (e) => {
    e.preventDefault();
    setLoadingButtonModalCreate(true);

    try {
      if (selectedFile) {
        const response = await axios.post(
          `https://apis.ezpics.vn/apis/createProductAPI`,
          {
            token: checkTokenCookie(),
            type: "user_create",
            category_id: 0,
            sale_price: 0,
            name: `Mẫu thiết kế ${Math.floor(Math.random() * 100001)}`,
            background: selectedFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response && response.data && response.data.code === 0) {
          setLoadingButtonModalCreate(false);
          setOpenModalCreating(false);
          document.body.style.overflowY = "auto";
          toast.success("Tạo thiết kế thành công, xin chờ giây lát", {
            autoClose: 500,
          });

          setTimeout(function () {
            router.push(`/design/${response.data.product_id}`);
          }, 1500);
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

  //Button tạo thiết kế in hàng loạt
  const handleCreatePrint = async (e) => {
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
            name: `Mẫu thiết kế ${Math.floor(Math.random() * 100001)}`,
            background: selectedFile,
            type_editor: 0,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response && response.data && response.data.code === 0) {
          setLoadingButtonModalCreate(false);
          setOpenModalCreating(false);
          document.body.style.overflowY = "auto";
          toast.success("Tạo thiết kế thành công, xin chờ giây lát", {
            autoClose: 500,
          });

          setTimeout(function () {
            router.push(`/design/${response.data.product_id}`);
          }, 1500);
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

  //Button tạo thiết kế theo kích thước tùy chỉnh
  const handleCreate = async (data) => {
    try {
      const response = await axios.post(
        `https://apis.ezpics.vn/apis/createProductAPI`,
        {
          background: data.image,
          token: checkTokenCookie(),
          type: "user_create",
          category_id: 0,
          sale_price: 0,
          name: `Mẫu thiết kế ${Math.floor(Math.random() * 100001)}`,
          // data.image
        }
      );

      if (response && response.data && response.data.code === 0) {
        toast.success("Tạo thiết kế thành công, xin chờ giây lát", {
          autoClose: 500,
        });
        setTimeout(function () {
          router.push(`/design/${response.data.product_id}`);
        }, 1500);
        // console.log(response.data.product_id);
      }
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error("Error creating product:", error);
      // Bạn có thể thêm thông báo cho người dùng ở đây nếu muốn
    }
  };

  //Button tao thiep moi
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
          setOpenModalCreating(false);
          document.body.style.overflowY = "auto";
          toast.success("Tạo thiết mời thành công, xin chờ giây lát", {
            autoClose: 500,
          });

          setTimeout(function () {
            router.push(`/invitation/${response.data.product_id}`);
          }, 1500);
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

  const handleLogout = async (e) => {
    const response = await logoutService({
      token: checkTokenCookie(),
    });
    clearAllCookies();
    // await signOut({});
    document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    dispatch(DELETE_ALL_VALUES());

    router.push("https://ezpics.vn");
    // }
  };

  const handleLogoutNew = async (e) => {
    try {
      // Gọi dịch vụ logout và xóa các cookies
      await logoutService({
        token: checkTokenCookie(),
      });

      // Xóa tất cả cookies
      clearAllCookies();
      document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Xóa trạng thái trong Redux
      dispatch(DELETE_ALL_VALUES());

      // Điều hướng tới trang chính và tải lại trang
      router.push("https://ezpics.vn").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { href: "/", label: "Trang chủ", hiddenOn: "sm" },
    { href: "/new-product", label: "Thiết kế mới", hiddenOn: "md" },
    { href: "/project", label: "Chủ đề", hiddenOn: "lg" },
    { href: "/collection-all", label: "Bộ sưu tập", hiddenOn: "lg" },
    {
      href: "/project-print",
      label: "Thư mời - Avatar",
      hiddenOn: "lg",
    },
    {
      label: "Hướng dẫn",
      hiddenOn: "lg",
      href: "https://www.youtube.com/playlist?list=PLngg14zy8vvwLxThvcL8g35G0F9VlNXUh",
    },
    { href: "/post", label: "Tin tức", hiddenOn: "xl" },
    {
      href: "https://www.facebook.com/ezpicsvn",
      label: "Hỗ trợ",
      hiddenOn: "xl",
    },
  ];

  const actionIcons = [
    {
      icon: <DownloadOutlined style={{ fontSize: "20px" }} />,
      name: "download",
      desc: "Tải xuống ứng dụng",
      href: "/download",
    },
    {
      icon: <SettingOutlined style={{ fontSize: "20px" }} />,
      name: "setting",
      desc: "Cài đặt",
      href: "/information",
    },
    // {
    //   icon: <BellOutlined style={{ fontSize: "20px" }} />,
    //   name: "bell",
    //   desc: "Thông báo",
    // },
  ];

  const formattedBalance =
    dataInforUser?.account_balance?.toLocaleString("vi-VN");
  const itemsDropdowUser = [
    {
      label: (
        <div className="flex items-center p-5 space-x-4">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              className="object-cover w-full h-full"
              alt="User Avatar"
              src={dataInforUser?.avatar}
            />
          </div>
          <div>
            <p className="text-lg font-bold">{dataInforUser?.name}</p>
            <p>
              Tài khoản:{" "}
              <span className="text-green-500">{formattedBalance}₫</span>
            </p>
          </div>
        </div>
      ),
      key: "11",
    },
    {
      label: (
        <Link href={"/page-satisfied/your-design"} className="list-item">
          <p className="item-text">Trang cá nhân</p>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link href={"/favorite_designs"} className="list-item">
          <p className="item-text">Mẫu thiết kế yêu thích</p>
        </Link>
      ),
      key: "6",
    },
    {
      label: (
        <Link href={"/information"} className="list-item ">
          <p className="item-text">Sửa thông tin cá nhân</p>
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <div className="list-item ">
          <p className="item-text">Tải ứng dụng Ezpics</p>
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <Link href={"/affiliate"} className="list-item ">
          <p className="item-text">Giới thiệu bạn bè</p>
        </Link>
      ),
      key: "4",
    },
    {
      label: (
        <div className="list-item " onClick={handleLogoutNew}>
          <p className="item-text">Đăng xuất </p>
        </div>
      ),
      key: "5",
    },
  ];

  //Responsive header
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [submenuVisible, setSubmenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getHiddenClass = (hiddenOn) => {
    switch (hiddenOn) {
      case "xl":
        return windowWidth <= 1280 ? "hidden" : "";
      case "lg":
        return windowWidth <= 1024 ? "hidden" : "";
      case "md":
        return windowWidth <= 768 ? "hidden" : "";
      case "xs":
        return "";
      default:
        return "";
    }
  };

  const shouldShowInDropdown = (hiddenOn) => {
    switch (hiddenOn) {
      case "xl":
        return windowWidth < 1280;
      case "lg":
        return windowWidth < 1024;
      case "md":
        return windowWidth < 768;
      case "xs":
        return true;
      default:
        return false;
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleSubmenu = () => {
    setSubmenuVisible(!submenuVisible);
  };
  const styleModalBuyingFree = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: "15px",
    borderRadius: "15px",
  };

  return (
    <SessionProvider>
      <div className="fixed w-full z-50 flex justify-between h-[--header-height] px-1 mobile:px-6 shadow-xl bg-white">
        <div className="flex items-center justify-center">
          <div className="p-1 mr-4 icon-primary mobile:p-3">
            <button onClick={() => toggleNavbar()}>
              <BarsOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
          <div className="flex items-center justify-center logo">
            <Link href="/" className="flex flex-center">
              <Image
                className="inline object-contain rounded_image"
                priority={true}
                src={images.logo}
                style={{ maxWidth: "40px", maxHeight: "40px" }}
                alt="Ezpics Logo"
              />
            </Link>
          </div>

          <div className="relative items-center md:flex">
            <div className="hidden overflow-hidden sm:flex">
              {menuItems.map((menuItem, index) => (
                <div
                  key={index}
                  className={`${getHiddenClass(menuItem.hiddenOn)} `}
                >
                  {!menuItem.subMenu ? (
                    // Check if the current menu item is "Hướng dẫn"
                    menuItem.label === "Hướng dẫn" ? (
                      <a
                        href={menuItem.href}
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        className={`primary_btn pl-10 whitespace-nowrap ${
                          activeHeader === index &&
                          "underline decoration-yellow-600 underline-offset-4"
                        } rounded-lg`}
                      >
                        {menuItem.label}
                      </a>
                    ) : (
                      <Link
                        href={menuItem.href}
                        className={`primary_btn pl-10 whitespace-nowrap ${
                          activeHeader === index &&
                          "underline decoration-yellow-600 underline-offset-4"
                        } rounded-lg`}
                        onClick={() => handleHeaderItem(index)} // Handle click for other items
                      >
                        {menuItem.label}
                      </Link>
                    )
                  ) : (
                    <div>
                      <button
                        className="flex items-center pl-10 primary_btn whitespace-nowrap"
                        onClick={() => toggleSubmenu()}
                      >
                        {menuItem.label}
                        <DownOutlined className="ml-2" />
                      </button>
                      {submenuVisible && (
                        <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                          {menuItem.subMenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="relative">
              <button
                className="pl-4 text-xl mobile:pl-10 xl:hidden"
                onClick={() => toggleDropdown()}
              >
                <EllipsisOutlined />
              </button>
              {dropdownVisible && (
                <div className="absolute right-[-85px] mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {menuItems.map(
                    (menuItem, index) =>
                      shouldShowInDropdown(menuItem.hiddenOn) &&
                      (!menuItem.subMenu ? (
                        <Link
                          key={index}
                          href={menuItem.href}
                          className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap"
                        >
                          {menuItem.label}
                        </Link>
                      ) : (
                        <div key={index} className="relative">
                          <button
                            className="items-center block w-full px-4 py-2 text-left text-black hover:bg-gray-100 whitespace-nowrap"
                            onClick={() => toggleSubmenu()}
                          >
                            {menuItem.label}
                            <RightOutlined className="ml-2" />
                          </button>
                          {submenuVisible && (
                            <div className="absolute top-0 left-[102%] w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              {menuItem.subMenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center action">
          <button
            className="bg-red-700 text-white whitespace-nowrap text-xs mobile:text-base p-[6px] mobile:px-[1.25rem] rounded-[0.25rem] py-[0.5rem] ml-2 mobile:ml-6"
            onClick={() => handleAddNewDesign()}
          >
            Tạo thiết kế
          </button>
          {creatingBucket && (
            <div className="relative">
              <div
                className="absolute top-7 right-full w-[330px] max-h-[400px] bg-white overflow-y-auto rounded-[10px]"
                style={{ scrollbarWidth: "thin", scrollbars: "false" }}
              >
                <div
                  className="list-item"
                  onClick={() => {
                    setCreatingBucket(false);
                    handleShowModalCreating();
                    document.body.style.overflowY = "hidden";
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6.165V19a2 2 0 0 0 2 2h12.835c-.06-.05-.12-.102-.176-.159L16.318 19.5H5a.5.5 0 0 1-.5-.5V7.682L3.159 6.341A2.275 2.275 0 0 1 3 6.165ZM17.28 4.22a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72H6.56l.72.72a.75.75 0 0 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 1.06L6.56 4h8.38l-.72-.72a.75.75 0 0 1 1.06-1.06l2 2ZM19.78 19.78a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V9.06l-.72.72a.75.75 0 1 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L20 9.06v8.38l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2Z"
                      fill="black"
                    ></path>
                  </svg>
                  <p className="item-text">Cỡ tùy chỉnh</p>
                </div>
                <div
                  className="list-item border-b-[0.5px] border-[#BFC4C8]"
                  onClick={() => {
                    setCreatingBucket(false);
                    handleShowModalCreatingPrint();
                    document.body.style.overflowY = "hidden";
                  }}
                >
                  <Image
                    src={designIcon.paperRolls}
                    alt=""
                    className="w-6 h-6"
                  />
                  <p className="item-text">Mẫu in hàng loạt</p>
                </div>
                <p className="m-0 text-[rgba(13,18,22,0.7)] text-[14px] font-semibold pt-1.5 pl-3">
                  Đề xuất
                </p>
                {dataSizeBox.map((item, index) => (
                  <div key={index} onClick={() => handleCreate(item)}>
                    <div className="list-item">
                      <Image src={item.icon} alt="" width={24} height={24} />
                      <p className="item-text">{item.name}</p>
                      <span className="size">
                        {item.width} x {item.height} px
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAuth ? (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              arrow={true}
              dropdownRender={() => (
                <div
                  style={{
                    maxHeight: "400px",
                    background: "white",
                    overflowY: "overlay",
                    borderRadius: "10px",
                    scrollbarWidth: "thin",
                    scrollbars: "false",
                  }}
                >
                  {itemsDropdowUser.map((item) => (
                    <div key={item.key}>{item.label}</div>
                  ))}
                </div>
              )}
            >
              <div
                style={{
                  cursor: "pointer",
                }}
              >
                <Space>
                  <div className="w-10 h-10 m-5 overflow-hidden rounded-full">
                    <img
                      className="object-cover w-full h-full rounded-full"
                      alt="User Avatar"
                      src={dataInforUser?.avatar}
                    />
                  </div>
                </Space>
              </div>
            </Dropdown>
          ) : (
            <div>
              <button
                className="flex items-center p-2 py-2 mx-2 text-xs text-red-600 border-2 border-red-600 roundedp mobile:px-5 mobile:mx-4 whitespace-nowrap mobile:text-base"
                onClick={() => {
                  router.push(`/sign-in`);
                }}
              >
                <UserOutlined />
                <p className="pl-2">Đăng nhập</p>
              </button>
            </div>
          )}
        </div>
        <div
          className={`fixed bottom-4 right-4 p-2 rounded-lg shadow-lg transition-opacity duration-500 ${
            isOnline
              ? "bg-green-500 text-white opacity-0"
              : "bg-red-500 text-white opacity-100"
          } ${show ? "opacity-100" : "opacity-0"}`}
          style={{ transition: "opacity 1s" }}
        >
          {isOnline ? (
            <p>Bạn đang trực tuyến.</p>
          ) : (
            <p>
              Bạn đang ngoại tuyến. Vui lòng kiểm tra kết nối internet của bạn.
            </p>
          )}
          {/* <ScrollToTopButton/> */}
        </div>
        {/* <div> */}
        <Modal
          footer={null}
          open={modalLogoutDevice}
          onClose={handleLogoutDevice}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="flex flex-col items-center justify-center">
            <p
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: "bold",
                paddingBottom: "10px",
              }}
            >
              Cảnh báo
            </p>
            <Image src={contactInfo.warning} alt="" width={150} height={150} />
            <p className="py-6 text-sm font-semibold">
              Tài khoản đã bị đăng nhập ở thiết bị khác
            </p>
            <div className="flex items-center justify-center">
              <Button
                variant="contained"
                size="medium"
                className="button-red"
                onClick={() => handleLogoutNew()}
              >
                Đăng nhập lại
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal
          open={openModalCreating}
          onCancel={handleCanCelModalCreating}
          footer={null}
          width={"30%"}
        >
          <div className="bg-modal-creating rounded-lg overflow-hidden bg-no-repeat bg-cover w-full h-[180px]">
            <h1 className="text-2xl font-bold text-[#735400] ml-[22px] mt-10">
              Bắt đầu tạo mẫu thiết kế
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
                  <img
                    id="file-image"
                    src="#"
                    alt="Preview"
                    className="hidden"
                  />
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
                  onClick={(e) => handleCreateCustom(e)}
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

        <Modal
          open={openModalCreatingPrint}
          onCancel={handleCanCelModalCreatingPrint}
          footer={null}
          width={"30%"}
        >
          <div className="bg-modal-creating rounded-lg overflow-hidden bg-no-repeat bg-cover w-full h-[180px]">
            <h1 className="text-2xl font-bold text-[#735400] ml-[14px] mt-10">
              Bắt đầu tạo mẫu in hàng loạt
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
                  <img
                    id="file-image"
                    src="#"
                    alt="Preview"
                    className="hidden"
                  />
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
                  onClick={(e) => handleCreatePrint(e)}
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
                  <img
                    id="file-image"
                    src="#"
                    alt="Preview"
                    className="hidden"
                  />
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
    </SessionProvider>
  );
};

export default Header;
