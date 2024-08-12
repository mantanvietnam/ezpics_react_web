import React from "react";

const ArrowTop = ({ size }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24">
      <path
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 5 6 6m-6-6-6 6m6-6v14"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowTop;
