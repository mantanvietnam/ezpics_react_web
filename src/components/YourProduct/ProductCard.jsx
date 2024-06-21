import Image from "next/image";
import React from "react";
import { designAction } from "../../../public/images/index2";
import { Skeleton } from "antd";

export default function ProductCard({
  products,
  onDeleteProduct,
  onDownloadProduct,
  onDuplicateProduct,
}) {
  let buttonsData = [
    {
      text: "Sửa",
      icon: designAction.edit,
      action: (productId) =>
        console.log("Edit action for product ID:", productId),
    },
    {
      text: "Xóa",
      icon: designAction.delete,
      action: onDeleteProduct,
    },
  ];

  if (onDuplicateProduct) {
    buttonsData.push({
      text: "Nhân bản",
      icon: designAction.copy,
      action: onDuplicateProduct,
    });
  }

  return (
    <div
      className={`w-[100%] mx-auto grid grid-cols-4 grid-flow-row ${
        !onDuplicateProduct ? "gap-8" : "gap-4"
      }`}>
      {products?.map((product) => (
        <div
          className="relative card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58"
          key={product.id}>
          <div className="relative bg-orange-100">
            {product.image ? (
              <Image
                src={product.image}
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
            {/* Button overlay */}
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <div className="flex flex-wrap justify-center">
                {buttonsData.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => button.action(product.id)}
                    className="flex items-center justify-center mb-2 p-2 bg-white rounded-lg hover:bg-gray-200 transition duration-300 mr-2"
                    style={{ width: "100px" }}>
                    <Image
                      src={button.icon}
                      alt={button.text}
                      className="w-5 h-5"
                    />
                    <span className="ml-2 text-sm">{button.text}</span>
                  </button>
                ))}
                <button
                  onClick={() => onDownloadProduct(product.image)}
                  className="flex items-center justify-center mb-2 p-2 bg-white rounded-lg hover:bg-gray-200 transition duration-300 mr-2"
                  style={{ width: "100px" }}>
                  <Image
                    src={designAction.download}
                    alt="Tải xuống"
                    className="w-5 h-5"
                  />
                  <span className="ml-2 text-sm">Tải Xuống</span>
                </button>
              </div>
            </div>
          </div>
          <div className="py-4 px-2">
            <h2 className="text-lg font-medium h-20">{product.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
