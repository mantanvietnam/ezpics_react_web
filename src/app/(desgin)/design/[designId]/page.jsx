"use client";

import Navbar from "./components/Navbar/Navbar";
import Toolbox from "./components/Toolbox/Toolbox";

const page = () => {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <Navbar />
        <Toolbox />
      </div>
    </>
  );
};

export default page;
