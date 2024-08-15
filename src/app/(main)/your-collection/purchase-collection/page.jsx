"use client";
import React, { useEffect, useState } from "react";
import { checkTokenCookie } from "@/utils/cookie";
import {
  getListBuyWarehousesAPI,
  getProductsWarehousesAPI,
} from "@/api/product";
import { Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import { convertSLugUrl } from "../../../../utils/url";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListBuyWarehousesAPI({
          token: checkTokenCookie(),
        });
        console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductClick = async (productId) => {
    setSelectedProduct(productId);
    setDetailsLoading(true);
    try {
      const response = await getProductsWarehousesAPI({
        idWarehouse: productId,
        limit: 100,
        page: 1,
      });
      console.log(response.data);
      setProductDetails(response.data);
      setDetailsLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error.message);
      setDetailsLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedProduct(null);
    setProductDetails([]);
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="w-[100%] mx-auto">
      {selectedProduct ? (
        <div>
          {detailsLoading ? (
            <Skeleton />
          ) : (
            <div>
              <button
                className=" border-2 border-gray-400 px-4 py-2 rounded-xl shadow-xl font-normal"
                onClick={handleBackClick}>
                &lt; Quay lại
              </button>

              {productDetails.length === 0 ? (
                <div className="text-center mt-8 my-2">
                  <p  className="text-center my-4">Bạn chưa có mẫu thiết kế nào.</p>
                  <Link href="/">
                    <button className="button-red">Về trang chủ</button>
                  </Link>
                </div>
              ) : (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                  {productDetails.map((product) => (
                    <Link
                      href={`/category/${convertSLugUrl(product.name)}-${product.id}.html`}
                      className="slide-content"
                      key={product.id}>
                      <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
                        <div className="bg-orange-100 overflow-hidden group">
                          <Image
                            src={product.image}
                            width={300}
                            height={200}
                            className="object-contain h-48 w-96 transition-transform duration-300 ease-in-out group-hover:scale-110"
                            alt={product.name}
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-medium h-20">
                            {product.name}
                          </h2>
                          <p className="text-gray-500 mt-2 text-sm">
                            Đã bán {product.sold}
                          </p>
                          <div className="mt-2">
                            <span className="text-red-500 mr-2 font-bold text-sm">
                              {product.sale_price === 0
                                ? "Miễn phí"
                                : VND.format(product.sale_price)}
                            </span>
                            <span className="text-gray-500 line-through">
                              {VND.format(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-flow-row gap-4">
          {products?.map((product) => (
            <div
              className="relative card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58"
              key={product.id}
              onClick={() => handleProductClick(product.id)}>
              <div className="relative bg-orange-100">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    width={300}
                    height={200}
                    className="object-contain h-48 w-96"
                    alt={product.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Skeleton
                      avatar
                      paragraph={{
                        rows: 4,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="py-4 px-2">
                <h2 className="text-lg font-medium h-20">{product.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
