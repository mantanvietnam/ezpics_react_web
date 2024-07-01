import { getLogoProductApi } from "@/api/product";
import DefaultSlide from "./DefaultSlide";

const LiveProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getLogoProductApi({
          category_id: "2",
          limit: "12",
          page: "1",
        }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Banner LiveStream"
      pathString="/dashboard-search"
    />
  );
};

export default LiveProductSlider;
