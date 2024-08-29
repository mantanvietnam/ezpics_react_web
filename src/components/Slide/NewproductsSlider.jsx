import DefaultSlide from "./DefaultSlide";
import { getNewProducts } from "@/api/product";

const NewProductsSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await getNewProducts();
        return products;
      }}
      title="Mẫu thiết kế mới nhất"
      pathString="/project-new"
    />
  );
};

export default NewProductsSlider;
