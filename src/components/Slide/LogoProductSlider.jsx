import { getLogoProductApi } from "@/api/product";
import DefaultSlide from "./DefaultSlide";

const LogoProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getLogoProductApi({
          category_id: "39",
          limit: "12",
          page: "1",
        }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Logo thương hiêu cá nhân"
      pathString="/"
    />
  );
};

export default LogoProductSlider;
