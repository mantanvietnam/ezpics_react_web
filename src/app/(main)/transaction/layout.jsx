import React from 'react'

export const metadata = {
  title: "Tổng quan giao dịch | Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    title: "Tổng quan giao dịch | Ezpics",
    description: "Ezpics - Dùng là thích",
    type: "website",
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

const transaction = ({children}) => {
  return <>{children}</>;
}

export default transaction