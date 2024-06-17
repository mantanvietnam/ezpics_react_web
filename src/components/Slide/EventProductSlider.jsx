import React from "react";
import DefaultSlide from "./DefaultSlide";
import { getLogoProductApi } from "@/api/product";

const EventProductSlider = () => {

  return (
    <DefaultSlide
      apiAction={async () => {
        const products = await getLogoProductApi({
          category_id: "9",
          limit: "12",
          page: "1",
        });
        return products;
      }}
      title="Banner event"
      pathString="/"
    />
  );
};

export default EventProductSlider;
