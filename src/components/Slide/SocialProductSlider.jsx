import { getLogoProductApi } from "@/api/product";
import DefaultSlide from "./DefaultSlide";

const SocialProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await getLogoProductApi({
          category_id: "17",
          limit: "12",
          page: "1",
        }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Ảnh bìa mạng xã hội"
      pathString="/project/anh-bia-mang-xa-hoi-17.html"
    />
  );
};

export default SocialProductSlider;
