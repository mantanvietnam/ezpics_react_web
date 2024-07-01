"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HomeBanner from "../../../components/HomeBanner";
import EndowProduct from "@/components/Slide/EndowProduct";
import EventProductSlider from "@/components/Slide/EventProductSlider";
import NewProductsSlider from "@/components/Slide/NewproductsSlider";
import SerisProductSlider from "@/components/Slide/SerisProductSlider";
import CollectionProductSlider from "@/components/Slide/CollectionProductSlider";
import ProductCard from "@/components/YourProduct/ProductCard";
import { checkTokenCookie } from "@/utils";
import Link from "next/link";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function HomeRoot(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyProductApi({
          type: "user_edit",
          token: checkTokenCookie(),
          limit: 12,
          page: 1,
        });
        setProducts(response.listData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const onDeleteProduct = async (productId) => {
    try {
      await deleteProductAPI({
        token: checkTokenCookie(),
        id: productId,
      });
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
      toast.success("Xóa thành công !!!");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Xóa sản phẩm không thành công.");
    }
  };

  return (
    <div className="flex-col w-[90%]">
      <div className="w-full pt-5">
        <HomeBanner />
      </div>
      {props.children}
      <NewProductsSlider />
      <SerisProductSlider />
      <CollectionProductSlider />
      <EndowProduct />
      <EventProductSlider />
      <div className="my-8 px-4">
        <h1 className="text-2xl font-bold py-4 text-start">Thiết kế gần đây</h1>
        <ProductCard products={products} onDeleteProduct={onDeleteProduct} />
      </div>

      <div className="flex justify-center mb-6">
        <Link href="/your-design/purchase-form">
          <button className="button-red relative z-10 px-4">Xem thêm</button>
        </Link>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
