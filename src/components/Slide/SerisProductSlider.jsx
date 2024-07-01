import DefaultSlide from "./DefaultSlide";
import { getserisProductApi } from "@/api/product";

const SerisProductSlider = () => {
  return (
    <DefaultSlide
      apiAction={async () => {
        // "use server";
        const response = await getserisProductApi({ limit: "12", page: "1" });
        const data = { listData: [...response.data] };
        return data; // Return the fetched products
      }}
      title="Mẫu thiết kế in hàng loạt"
      pathString="/dashboard-search"
    />
  );
};

export default SerisProductSlider;
