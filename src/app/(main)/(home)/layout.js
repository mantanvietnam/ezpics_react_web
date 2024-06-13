"use client";
import React, { useEffect, useState } from "react";
import { deleteProductAPI, getMyProductApi } from "@/api/product";
import { toast } from "react-toastify";
import HomeBanner from "@/components/HomeBanner";
import EndowProduct from "@/components/Slide/EndowProduct";
import EventProductSlider from "@/components/Slide/EventProductSlider";
import NewProductsSlider from "@/components/Slide/NewproductsSlider";
import SerisProductSlider from "@/components/Slide/SerisProductSlider";
import CollectionProductSlider from "@/components/Slide/collectionProductSlider";
import ProductCard from "@/components/YourProduct/ProductCard";
import { checkTokenCookie } from "@/utils";

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
  }, []); // Empty dependency array ensures useEffect runs only on mount

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
      <h1 className="text-2xl font-bold my-4">Thiết kế gần đây</h1>
      <ProductCard products={products} onDeleteProduct={onDeleteProduct} />
    </div>
  );
}
