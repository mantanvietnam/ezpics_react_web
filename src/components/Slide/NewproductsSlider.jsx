import DefaultSlide from "./DefaultSlide";
import { listProductRandomAPI } from "@/api/product";

const NewProductsSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await listProductRandomAPI();
        return products;
      }}
      title="Mẫu thiết kế mới nhất"
      pathString="/project-new"
    />
  );
};

export default NewProductsSlider;
