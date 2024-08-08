"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import "@/styles/globals.scss";

export default function CenteredLayouts(props) {
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

  const closeNavbar = () => {
    if (isMobile) {
      setIsNavbarOpen(false);
    }
  };

  //active header
  const [activeHeader, setActiveHeader] = useState("");

  const handleHeaderItem = (item) => {
    setActiveHeader(item);
    setActiveItem(null);
    setActiveFunc(null);
  };

  //Them bg vao button khi chon tren thanh nav
  const [activeItem, setActiveItem] = useState(0);
  const [activeFunc, setActiveFunc] = useState("");

  const handleNavItem = (item) => {
    setActiveItem(item);
    setActiveFunc(null);
    setActiveHeader(null);
    closeNavbar(); // Close the navbar when a link is clicked
  };

  const hanldeFuncItem = (item) => {
    setActiveFunc(item);
    setActiveItem(null);
    setActiveHeader(null);
    closeNavbar(); // Close the navbar when a link is clicked
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SessionProvider className="font-poppins">
        <Header
          toggleNavbar={toggleNavbar}
          activeHeader={activeHeader}
          handleHeaderItem={handleHeaderItem}
        />
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-0 ${
            isNavbarOpen && isMobile
              ? "opacity-50 z-40 ml-[250px]"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleNavbar}></div>
        <main className="flex pt-[var(--header-height)] font-poppins">
          <Nav
            isOpen={isNavbarOpen}
            closeNavbar={closeNavbar}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            handleNavItem={handleNavItem}
            activeFunc={activeFunc}
            setActiveFunc={setActiveFunc}
            hanldeFuncItem={hanldeFuncItem}
          />
          {isMobile ? (
            <div className=" w-full flex flex-col justify-center items-center">
              {props.children}
              <div
                className={`transition-all duration-300 w-[100%] flex justify-center`}>
                <Footer />
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center transition-all duration-300 ${
                isNavbarOpen ? "ml-[250px] w-[calc(100%-250px)]" : "ml-0 w-full"
              } flex justify-center`}>
              {props.children}
              <div
                className={`transition-all duration-300 w-[100%] flex justify-center`}>
                <Footer />
              </div>
            </div>
          )}
        </main>
      </SessionProvider>
    </>
  );
}
