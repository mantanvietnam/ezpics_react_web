import { getNewProducts } from "@/lib/actions/actions";
import DefaultSlide from "./DefaultSlide";

const NewProductsSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getNewProducts(); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Mẫu thiết kế mới nhất"
    />
  );
};

export default NewProductsSlider;
