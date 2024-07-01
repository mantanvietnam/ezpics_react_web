import Image from "next/image";
import React from "react";
import { designAction } from "../../../public/images/index2";
import { Skeleton } from "antd";
import "@/styles/home/header.scss";

export default function ProductCard({
  products,
  onEditProduct,
  onDeleteProduct,
  onDownloadProduct,
  onDuplicateProduct,
  onPrintedPhoto,
}) {
  let buttonsData = [
    {
      text: "Sửa",
      icon: designAction.edit,
      action: onEditProduct,
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
      {products?.map((product) => {
        let buttonsData2 = [...buttonsData];

        if (onPrintedPhoto && product.status === 1) {
          buttonsData2.push({
            text: "In ảnh",
            icon: designAction.copy,
            action: onPrintedPhoto,
          });
        }
        if (onDownloadProduct && product.status === 0) {
          buttonsData2.push({
            text: "Tải xuống",
            icon: designAction.download,
            action: () => onDownloadProduct(product.image),
          });
        }
        return (
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
                  {buttonsData2.map((button, index) => (
                    <button
                      key={index}
                      onClick={() => button.action(product.id)}
                      className="flex items-center justify-center group mb-2 p-2 bg-white rounded-lg hover:bg-gray-200 transition duration-300 mr-2"
                      style={{ width: "100px" }}>
                      <div className="relative flex items-center">
                        <Image
                          src={button.icon}
                          alt={button.text}
                          className="w-5 h-5"
                        />
                        <div className="absolute opacity-0 group-hover:opacity-100 mt-6 left-1/2 transform -translate-x-1/2 top-0 p-2 bg-neutral-600 rounded text-white text-xs whitespace-nowrap">
                          {button.text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="py-4 px-2">
              <h2 className="text-lg font-medium h-20">{product.name}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
