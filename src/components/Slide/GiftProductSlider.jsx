import React from "react";
import { getLogoProductApi } from "@/api/product";
import DefaultSlide from "./DefaultSlide";

const GiftProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await getLogoProductApi({
          category_id: "14",
          limit: "12",
          page: "1",
        }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Thẻ quà tặng - Thẻ giảm giá"
      pathString="/project/the-qua-tang-the-giam-gia-14.html"
    />
  );
};

export default GiftProductSlider;
