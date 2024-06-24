"use client";

import RecommendAction from "@/components/RecommendPage/RecommendAction";
import RecommendBanner from "@/components/RecommendPage/RecommendBanner";
import NewProductsSlider from "@/components/Slide/NewproductsSlider";
import React from "react";

export default function layout(props) {
  return (
    <div className="flex-col w-[90%]">
      <div className="w-full pt-5">
        <RecommendBanner />
      </div>
      <div>
        <RecommendAction />
      </div>
      {props.children}
      <NewProductsSlider />
    </div>
  );
}
