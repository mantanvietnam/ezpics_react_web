import { getInfoWarehouseApi } from "@/api/product";
import ProductPage from "./productPage";

export async function generateMetadata({ params }) {
  const slug = params?.slug?.split(".html")[0];
  const temp = slug?.split("-");
  const id = temp?.pop();
  const response = await getInfoWarehouseApi({ idWarehouse: `${id}` });
  const product = response.data;
  return {
    title: product.name,
    description: `Mẫu ${product.name} đã bán được ${
      product.number_product
    } mẫu với giá bán ${product.price ? product.price : "miễn phí"}`,
    openGraph: {
      title: product.name,
      type: "website",
      description: `Mẫu ${product.name} đã bán được ${
        product.number_product
      } mẫu với giá bán ${product.price ? product.price : "miễn phí"}`,
      images: product.thumbnail || product.thumn || product.image,
    },
  };
}

export default async function Page({ params }) {
  const slug = params?.slug?.split(".html")[0];
  const temp = slug?.split("-");
  const productId = temp?.pop();
  return (
    <>
      <ProductPage params={productId} />
    </>
  );
}
