import DefaultSlide from "./DefaultSlide";
import { getLogoProductApi } from "@/api/product";

const EndowProduct = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await getLogoProductApi({
          category_id: "12",
          limit: "12",
          page: "1",
        });
        return products;
      }}
      title="Banner Ưu đãi"
      pathString="/project/uu-dai-khuyen-mai-12.html"
    />
  );
};

export default EndowProduct;
