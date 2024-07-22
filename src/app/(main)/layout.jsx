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

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SessionProvider className="font-poppins">
        <Header toggleNavbar={toggleNavbar} />
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-0 ${
            isNavbarOpen && isMobile
              ? "opacity-50 z-40 ml-[250px]"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleNavbar}></div>
        <main className="flex pt-[var(--header-height)] font-poppins">
          <Nav isOpen={isNavbarOpen} closeNavbar={closeNavbar} />
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
