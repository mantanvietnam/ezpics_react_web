import React from "react";

export const metadata = {
  title: "Tin tức | Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    title: "Tin tức  | Ezpics",
    description: "Ezpics - Dùng là thích",
    type: "website",
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

const Page = ({ children }) => {
  return <>{children}</>;
};

export default Page;
