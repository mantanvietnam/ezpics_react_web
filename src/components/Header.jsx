"use client";
import {
  BarsOutlined,
  BellOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
  EllipsisOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import "@/styles/home/header.scss";
import { useRouter } from "next/navigation";
import { Divider, Dropdown, Space } from "antd";
import images, { designIcon } from "../../public/images/index2";
import { useEffect, useRef, useState } from "react";
import { checkAvailableLogin, checkTokenCookie, getCookie } from "@/utils";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { DELETE_ALL_VALUES } from "../redux/slices/user/userSlice";
import { logoutService } from "@/api/auth";
import { toast } from "react-toastify";

const Header = ({ toggleNavbar }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isAuth = checkAvailableLogin();
  const [dataInforUsercheck, setdataInforUsercheck] = useState(null);
  const cookie = checkTokenCookie()

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await axios.post('https://apis.ezpics.vn/apis/getInfoMemberAPI', {
          token: cookie
        });
        if (response) {
          setdataInforUsercheck(response?.data?.data)
        } else {
          console.error("Invalid response format for categories");
        }
      } catch (error) {
        throw new Error(error)
      }

    }
    fetchDataUser();
  }, [cookie])
  if (dataInforUsercheck?.otp != null) {
    setTimeout(() => {
      toast.warning('Bạn chưa xác thực số điện thoại chúng tôi sẽ chuyển hướng tới xác thực')
      router.push('/OtpVerification'); // Redirect to a welcome page or dashboard after successful verification
    }, 10000)
  }
  console.log('dataInforUser',)
  // Lấy data user
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  const handleLogout = async (e) => {
    const response = await logoutService({
      token: checkTokenCookie(),
    });
    await signOut({});
    // if (response && response?.code === 0) {
    document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    dispatch(DELETE_ALL_VALUES());
    // }
  };

  const menuItems = [
    { href: "/", label: "Trang chủ", hiddenOn: "sm" },
    { href: "/new-product", label: "Thiết kế mới", hiddenOn: "lg" },
    { href: "/pricing-compare", label: "Bảng giá", hiddenOn: "lg" },
    {
      label: "Hướng dẫn",
      hiddenOn: "xl",
      subMenu: [
        {
          href: "https://www.youtube.com/watch?v=7zSlqhcsHLI&list=PLngg14zy8vvw-hSi3ly3ehls1RHTWgQdJ",
          label: "Điện thoại",
        },
        { href: "/guide/desktop", label: "Máy tính" },
      ],
    },
    { href: "/post", label: "Tin tức", hiddenOn: "xl" },
  ];

  const actionIcons = [
    {
      icon: <DesktopOutlined style={{ fontSize: "20px" }} />,
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
    {
      icon: <BellOutlined style={{ fontSize: "20px" }} />,
      name: "bell",
      desc: "Thông báo",
    },
  ];

  const items = [
    {
      label: (
        <div className="list-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 6.165V19a2 2 0 0 0 2 2h12.835c-.06-.05-.12-.102-.176-.159L16.318 19.5H5a.5.5 0 0 1-.5-.5V7.682L3.159 6.341A2.275 2.275 0 0 1 3 6.165ZM17.28 4.22a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72H6.56l.72.72a.75.75 0 0 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 1.06L6.56 4h8.38l-.72-.72a.75.75 0 0 1 1.06-1.06l2 2ZM19.78 19.78a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V9.06l-.72.72a.75.75 0 1 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L20 9.06v8.38l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2Z"
              fill="black"></path>
          </svg>
          <p className="item-text">Cỡ tùy chỉnh</p>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div class="list-item border-b-[0.5px] border-[#BFC4C8]">
          <Image src={designIcon.paperRolls} alt="" className="w-6 h-6" />
          <p className="item-text">Mẫu in hàng loạt</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <p className="m-0 text-[rgba(13,18,22,0.7)] text-[14px] font-semibold pt-1.5 pl-3">
          Đề xuất
        </p>
      ),
      key: "2",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.presentation} alt="" className="w-6 h-6" />
          <p className="item-text">Bài thuyết trình (16:9)</p>
          <span className="size">1920 x 1080 px</span>
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.presentation} alt="" className="w-6 h-6" />
          <p className="item-text">Bài thuyết trình (9:16)</p>
          <span className="size">1080 x 1920 px</span>
        </div>
      ),
      key: "4",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.picture} alt="" className="w-6 h-6" />
          <p className="item-text">Logo</p>
          <span className="size">500 x 500 px</span>
        </div>
      ),
      key: "5",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.poster} alt="" className="w-6 h-6" />
          <p className="item-text">Poster (dọc)</p>
          <span className="size">4960 x 7015 px</span>
        </div>
      ),
      key: "6",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.instagram} alt="" className="w-6 h-6" />
          <p className="item-text">Bài đăng Instagram (vuông)</p>
          <span className="size">1080 x 1080 px</span>
        </div>
      ),
      key: "7",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Bài đăng Facebook (vuông)</p>
          <span className="size">940 x 788 px</span>
        </div>
      ),
      key: "8",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Avatar Facebook</p>
          <span className="size">761 x 761 px</span>
        </div>
      ),
      key: "9",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.facebook} alt="" className="w-6 h-6" />
          <p className="item-text">Ảnh bìa Facebook</p>
          <span className="size">1640 x 924 px</span>
        </div>
      ),
      key: "10",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.youtube} alt="" className="w-6 h-6" />
          <p className="item-text">Ảnh thumbnail video Youtube</p>
          <span className="size">1280 x 720 px</span>
        </div>
      ),
      key: "11",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.picture} alt="" className="w-6 h-6" />
          <p className="item-text">Hình nền máy tính </p>
          <span className="size">1920 x 1080 px</span>
        </div>
      ),
      key: "12",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A0 (dọc) </p>
          <span className="size">3179 x 4494 px</span>
        </div>
      ),
      key: "13",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A1 (dọc) </p>
          <span className="size">2245 x 3179 px</span>
        </div>
      ),
      key: "14",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A2 (dọc) </p>
          <span className="size">1578 x 2245 px</span>
        </div>
      ),
      key: "15",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A3 (dọc) </p>
          <span className="size">1123 x 1578 px</span>
        </div>
      ),
      key: "16",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A4 (dọc) </p>
          <span className="size">794 x 1123 px</span>
        </div>
      ),
      key: "17",
    },
    {
      label: (
        <div className="list-item">
          <Image src={designIcon.docs} alt="" className="w-6 h-6" />
          <p className="item-text">A5 (dọc) </p>
          <span className="size">559 x 794 px</span>
        </div>
      ),
      key: "18",
    },
  ];
  const formattedBalance =
    dataInforUser?.account_balance?.toLocaleString("vi-VN");
  const itemsDropdowUser = [
    {
      label: (
        <div className="flex items-center space-x-4 p-5">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="User Avatar"
              src={dataInforUser?.avatar}
            />
          </div>
          <div>
            <p className="font-bold text-lg">{dataInforUser?.name}</p>
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
        <div class="list-item ">
          <p className="item-text">Sửa thông tin cá nhân</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div class="list-item ">
          <p className="item-text">Khiếu nại </p>
        </div>
      ),
      key: "2",
    },
    {
      label: (
        <div class="list-item ">
          <p className="item-text">Tải ứng dụng Ezpics</p>
        </div>
      ),
      key: "3",
    },
    {
      label: (
        <div class="list-item ">
          <p className="item-text">Giới thiệu bạn bè</p>
        </div>
      ),
      key: "4",
    },
    {
      label: (
        <div class="list-item " onClick={handleLogout}>
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

  return (
    <SessionProvider>
      <div className="fixed w-full z-50 flex justify-between h-[--header-height] px-6 shadow-xl bg-white">
        <div className="flex justify-center items-center">
          <div className="p-3 mr-4 icon-primary">
            <button onClick={() => toggleNavbar()}>
              <BarsOutlined style={{ fontSize: "20px" }} />
          </button>
        </div>
        <div className="logo flex items-center justify-center">
          <Link href="/" className="flex flex-center">
            <Image
              className="object-contain rounded_image inline"
              priority={true}
              src={images.logo}
              style={{ maxWidth: "40px", maxHeight: "40px" }}
              alt="Ezpics Logo"
            />
          </Link>
        </div>

        <div className="relative items-center hidden md:flex">
          <div className="flex overflow-hidden">
            {menuItems.map((menuItem, index) => (
              // <Link
              //   key={index}
              //   href={menuItem.href}
              //   className={`primary_btn pl-10 whitespace-nowrap ${getHiddenClass(
              //     menuItem.hiddenOn
              //   )}`}>
              //   {menuItem.label}
              // </Link>

              <div
                key={index}
                className={`${getHiddenClass(menuItem.hiddenOn)}`}>
                {!menuItem.subMenu ? (
                  <Link
                    href={menuItem.href}
                    className="primary_btn pl-10 whitespace-nowrap">
                    {menuItem.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      className="primary_btn pl-10 whitespace-nowrap flex items-center"
                      onClick={() => toggleSubmenu()}>
                      {menuItem.label}
                      <DownOutlined className="ml-2" />
                    </button>
                    {submenuVisible && (
                      <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        {menuItem.subMenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap">
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
              className="text-xl pl-10 xl:hidden"
              onClick={() => toggleDropdown()}>
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
                        className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap">
                        {menuItem.label}
                      </Link>
                    ) : (
                      <div key={index} className="relative">
                        <button
                          className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap flex items-center w-full text-left"
                          onClick={() => toggleSubmenu()}>
                          {menuItem.label}
                          <RightOutlined className="ml-2" />
                        </button>
                        {submenuVisible && (
                          <div className="absolute top-0 left-[102%] w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            {menuItem.subMenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap">
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

      <div className="action flex justify-center items-center">
        <div className="hidden sm:flex">
          {actionIcons.map((social, index) =>
            index === 2 ? (
              <div className="icon-container" key={index}>
                <div className="p-3 icon-primary">{social.icon}</div>
                <div className="desc">{social.desc}</div>
              </div>
            ) : (
              <Link className="icon-container" href={social.href} key={index}>
                <div className="p-3 icon-primary">{social.icon}</div>
                <div className="desc">{social.desc}</div>
              </Link>
            )
          )}
        </div>
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
              }}>
              {items.map((item) => (
                <div key={item.key}>{item.label}</div>
              ))}
            </div>
          )}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <button className="button-red whitespace-nowrap">
                Tạo thiết kế
              </button>
            </Space>
          </a>
        </Dropdown>
        {isAuth ? (
          <div>
            {/* <img className="w-full h-full object-cover" alt="User Avatar" src={dataInforUser?.avatar} /> */}

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
                  }}>
                  {itemsDropdowUser.map((item) => (
                    <div key={item.key}>{item.label}</div>
                  ))}
                </div>
              )}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className="w-10 h-10 rounded-full overflow-hidden m-5">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      alt="User Avatar"
                      src={dataInforUser?.avatar}
                    />
                  </div>
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : (
          <div>
            <button
              className="flex border-red-600 text-red-600 border-2 rounded px-5 py-2 mx-4 whitespace-nowrap"
              onClick={() => {
                router.push("/sign-in");
              }}>
              <UserOutlined />
              <p className="pl-2">Đăng nhập</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </SessionProvider>
  );
};

export default Header;
