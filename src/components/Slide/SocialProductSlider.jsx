import { getLogoProductApi } from "@/api/product";
import DefaultSlide from "./DefaultSlide";

const SocialProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getLogoProductApi({
          category_id: "17",
          limit: "12",
          page: "1",
        }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ảnh bìa mạng xã hội"
      pathString="/dashboard-search"
    />
  );
};

export default SocialProductSlider;
