import React from "react";
import axios from "axios";

export async function generateMetadata({ params }) {
  const slug = params?.detailpost?.split(".html");
  const temp = slug[0]?.split("-");
  const id = temp[temp.length - 1];
  const response = await axios.post(
    "https://apis.ezpics.vn/apis/getInfoPostAPI",
    { id: id }
  );
  const product = response.data.data;
  return {
    title: product.title,
    description: product.description || `Bài viết ${product.title}`,
    openGraph: {
      title: product.title,
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

const Page = ({ children }) => {
  return <>{children}</>;
};

export default Page;
