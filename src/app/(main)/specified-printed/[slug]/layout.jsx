import { getInfoProductApi } from "@/api/product";
import React from "react";
export async function generateMetadata({ params }) {
  const slug = params?.slug?.split(".html");
  const temp = slug[0]?.split("-");
  const id = temp[temp.length - 1];
  const response = await getInfoProductApi({ id: `${id}` });
  const product = response.data;
  console.log(product);

  return {
    title: product.name,
    description: `Mẫu thiết kế ${product.title} của tác giả ${
      product.author
    } đã bán được ${product.sold} mẫu với giá bán ${
      product.sale_price ? product.sale_price : "miễn phí"
    }`,
    openGraph: {
      title: product.name,
      type: "website",
      description: `Mẫu thiết kế ${product.title} của tác giả ${
        product.author
      } đã bán được ${product.sold} mẫu với giá bán ${
        product.sale_price ? product.sale_price : "miễn phí"
      }`,
      images: product.thumbnail || product.thumn || product.image,
    },
  };
}

const transaction = ({ children }) => {
  return <>{children}</>;
};

export default transaction;
