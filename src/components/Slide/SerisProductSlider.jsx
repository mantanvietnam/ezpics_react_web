import DefaultSlidePrint from "./DefalultSlidePrint";
import { getserisProductApi } from "@/api/product";

const SerisProductSlider = () => {
  return (
    <DefaultSlidePrint
      apiAction={async () => {
        // "use server";
        const response = await getserisProductApi({ limit: "12", page: "1" });
        const data = { listData: [...response.data] };
        return data; // Return the fetched products
      }}
      title="Mẫu thiết kế in hàng loạt"
      pathString="/project-print"
    />
  );
};

export default SerisProductSlider;
