"use client";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { useState } from "react";

export default function CenteredLayout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className="">
      <Header toggleNavbar={toggleNavbar} />
      <main className="flex pt-[--header-height]">
        <Nav isOpen={isNavbarOpen} />
        <div
          className={`transition-all duration-300 ${
            isNavbarOpen ? "ml-[250px] w-[calc(100%-250px)]" : "ml-0 w-full"
          } flex justify-center`}>
          {/* <RequireAuth> */}
          {props.children}
          {/* </RequireAuth> */}
        </div>
      </main>
    </div>
  );
}
