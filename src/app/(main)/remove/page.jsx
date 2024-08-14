import React from "react";
import HeaderRemove from "@/components/remove/HeaderRemove";
import ContentRemove from "@/components/remove/ContentRemove";
import IntroduceApp from "@/components/remove/IntroduceApp";
import AdvantageApp from "@/components/remove/AdvantageApp";
import PerformanceApp from "@/components/remove/PerformanceApp";
import AskingApp from "@/components/remove/AskingApp";

export const metadata = {
  title: "Xóa nền | Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

const Page = () => {
  return (
    <div>
      <HeaderRemove />
      <ContentRemove />
      <IntroduceApp />
      <AdvantageApp />
      <PerformanceApp />
      <AskingApp />

    </div>
  );
};

export default Page;
