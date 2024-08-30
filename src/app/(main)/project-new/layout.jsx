import RecommendBanner from "@/components/RecommendPage/RecommendBanner";
import React from "react";

export const metadata = {
  title: "Danh mục | Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    title: "Danh mục | Ezpics",
    description: "Ezpics - Dùng là thích",
    type: "website",
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

export default function layout(props) {
  return (
    <div className="flex-col w-[90%]">
      <div className="w-full pt-5">
        <RecommendBanner />
      </div>
      <h1 className="text-2xl font-bold mt-2">Mẫu thiết kế mới</h1>
      {props.children}
    </div>
  );
}
