import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function ProductComponent({ product }) {
  return (
    <Link href={`/category/${product?.id}`} className="slide-content pr-8" key={product?.id}>
      <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
        <div className="bg-orange-100 overflow-hidden group">
          <Image
            src={product?.image}
            width={300}
            height={200}
            className="object-contain h-48 w-96 transition-transform duration-300 ease-in-out group-hover:scale-110"
            alt={product?.name}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-medium h-20">
            {product?.name}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Đã bán {product?.sold}
          </p>
          <div className="mt-2">
            <span className="text-red-500 mr-2 font-bold text-sm">
              {product?.sale_price === 0
                ? "Miễn phí"
                : VND.format(product?.sale_price)}
            </span>
            <span className="text-gray-500 line-through">
              {VND.format(product?.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
