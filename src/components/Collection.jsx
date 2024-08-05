import Link from 'next/link'
import React from 'react'
import Image from "next/image"
import TruncatedText from './TruncatedText';

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Collection({ collection }) {
  return (
    <Link href={`/collection-buying/${collection?.id}`} className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer max-w-64 sm:w-58">
      <div className="bg-orange-100 overflow-hidden group">
        <Image
          src={collection?.thumbnail}
          width={300}
          height={200}
          className="object-contain h-48 w-96 transition-transform duration-300 ease-in-out group-hover:scale-110"
          alt='ol'
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium h-20">
          <TruncatedText text={collection?.name} maxLength={33}/>
        </h2>
        <p className="text-gray-500 mt-2">
          Số lượng mẫu {collection?.number_product}
        </p>
        <div className="mt-2">
          <span className="text-red-500 font-bold mr-2 text-lg">
            {VND.format(collection?.price)}
          </span>
          <span className="text-gray-500 line-through"></span>
        </div>
      </div>
    </Link>
  )
}
