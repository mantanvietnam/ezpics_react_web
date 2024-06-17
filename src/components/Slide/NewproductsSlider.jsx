import React from "react";
import DefaultSlide from "./DefaultSlide";
import { getNewProducts } from "@/api/product";

const NewProductsSlider = () => {

  return (
    <DefaultSlide
      apiAction={async () => {
        const products = await getNewProducts();
        return products;
      }}
      title="Mẫu thiết kế mới nhất"
      pathString="new-product"
    />
  );
};

export default NewProductsSlider;
