"use client";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { useState, useEffect } from "react";

export default function CenteredLayout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsNavbarOpen(false); // Tự động ẩn navbar khi màn hình nhỏ hơn 1024px
      } else {
        setIsMobile(false);
        setIsNavbarOpen(true); // Hiển thị navbar khi màn hình lớn hơn 1024px
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className="">
      <Header toggleNavbar={toggleNavbar} />
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-100 ${
          isNavbarOpen && isMobile
            ? "opacity-50 z-40 ml-[250px]"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleNavbar}></div>
      <main className="flex pt-[var(--header-height)]">
        <Nav isOpen={isNavbarOpen} />
        {isMobile ? (
          <div className=" w-full flex justify-center">{props.children}</div>
        ) : (
          <div
            className={`transition-all duration-300 ${
              isNavbarOpen ? "ml-[250px] w-[calc(100%-250px)]" : "ml-0 w-full"
            } flex justify-center`}>
            {props.children}
          </div>
        )}
      </main>
    </div>
  );
}
