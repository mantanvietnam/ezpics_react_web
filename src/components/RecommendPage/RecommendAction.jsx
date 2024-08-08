"use client";
import Link from "next/link";
import { useState } from "react";

export default function RecommendAction() {
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = [
    {
      title: "Được đề suất",
      path: "recommend",
    },
    {
      title: "Thumbnails Youtube",
      path: "youtube",
    },
    {
      title: "Sự kiện",
      path: "cooking",
    },
    {
      title: "Logo",
      path: "logo",
    },
    {
      title: "Vinh danh",
      path: "congrat",
    },
    {
      title: "Banner",
      path: "banner",
    },
    {
      title: "Xem thêm",
      path: "more",
    },
  ];
  return (
    <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar">
      {actions.map((action, index) => (
        <div
          key={index}
          onClick={() => setActiveIndex(index)}
          className="relative">
          <Link
            href={action.path}
            className="w-[100px] mobile:w-fit p-3 flex items-center justify-center">
            <div className={`${
              activeIndex === index ? "text-[14px] font-bold opacity-100" : "text-[14px] font-semibold opacity-65 hover:opacity-100 ease-in duration-300"
            }`}>
              {action.title}
            </div>
          </Link>
          <div
            className={`${
              activeIndex === index ? "text-[14px] opacity-100 font-weight border-b-2 border-red-500" : ""
            }`}></div>
        </div>
      ))}
    </div>
  );
}
