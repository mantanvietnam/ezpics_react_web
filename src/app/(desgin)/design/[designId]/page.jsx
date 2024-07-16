"use client";

import Navbar from "./components/Navbar/Navbar";
import Toolbox from "./components/Toolbox/Toolbox";

const page = () => {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <Navbar />
        <Toolbox />
        <div className="relative z-1 bg-gray-300 h-[100%] ml-[396px]">
          <div className="flex h-[100%] justify-center items-center">
            <div className="h-[200px] w-[400px] bg-red-300"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
