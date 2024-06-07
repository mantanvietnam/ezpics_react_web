"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { StyledSlider, SampleNextArrow, SamplePrevArrow } from "./CustomSlide";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCollectionProductApi } from '@/api/product';

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const CollectionProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getCollectionProductApi();
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1220,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 940,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-[100%] mx-auto px-4 pt-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Bộ sưu tập thịnh hành</h1>
        <Link href='/' className="font-bold text-red-500 text-sm">
          Xem thêm
        </Link>
      </div>

      <div>
        <StyledSlider>
          <Slider {...settings} className="w-full relative">
            {products.map((product) => (
              <div className="slide-content pr-8" key={product.id}>
                <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
                  <div className="bg-orange-100">
                    <Image
                      src={product.thumbnail}
                      width={300}
                      height={200}
                      className="object-contain h-48 w-96"
                      alt={product.name}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium h-20">{product.name}</h2>
                    <p className="text-gray-500 mt-2">Số lượng mẫu {product?.number_product}</p>
                    <div className="mt-2">
                      <span className="text-red-500 font-bold mr-2">
                        {VND.format(product.price)}
                      </span>
                      <span className="text-gray-500 line-through">
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </StyledSlider>
      </div>
    </div>
  );
};

export default CollectionProductSlider;