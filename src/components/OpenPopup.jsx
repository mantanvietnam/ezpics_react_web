"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { detailProductSeriesAPI } from "@/api/product";

const OpenPopup = () => {
  const pathname = usePathname(); // Lấy pathname hiện tại
  const [linkPrint, setLinkPrint] = useState("");
  const [data, setData] = useState();

  // Kiểm tra pathname trước khi xử lý nó
  const slug = pathname ? pathname.split("/").pop().split(".html")[0] : "";
  const temp = slug?.split("-");
  const id = temp[temp.length - 1];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await detailProductSeriesAPI({
          idProduct: id,
        });
        setData(response?.data?.product);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (pathname.includes("/specified-printed")) {
      setLinkPrint(data?.link_open_app || "");
    } else {
      setLinkPrint("https://ezpics.page.link/vn1s");
    }
  }, [pathname, data]);


  return (
    <a
      href={linkPrint}
      className="h-10 bg-slate-900 text-white flex items-center pl-3 text-sm font-poppins">
      Mở ứng dụng
    </a>
  );
};

export default OpenPopup;
