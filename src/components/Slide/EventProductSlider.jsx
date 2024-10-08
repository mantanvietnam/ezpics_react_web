
import DefaultSlide from "./DefaultSlide";
import { getLogoProductApi } from "@/api/product";

const EventProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const products = await getLogoProductApi({
          category_id: "9",
          limit: "12",
          page: "1",
        });
        return products;
      }}
      title="Banner event"
      pathString="/project/su-kien-chuong-trinh-cuoc-thi-9.html"
    />
  );
};

export default EventProductSlider;
