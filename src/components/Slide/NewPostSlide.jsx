"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Skeleton } from "antd";

import {
  StyledSlider,
  SampleNextArrow,
  SamplePrevArrow,
  SkeletonCustom,
} from "./CustomSlide";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { convertSLugUrl } from "../../utils/url";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const DefaultSlide = ({ apiAction, title, pathString }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await apiAction();
        setProducts(response.listData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiAction]);

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
        <p className="text-2xl font-bold mb-4">{title}</p>
        <Link href={pathString} className="font-bold text-red-500 text-sm">
          Xem thêm
        </Link>
      </div>

      <div>
        <StyledSlider>
          {loading ? (
            <Slider {...settings} className="w-full relative">
              {[...Array(5).keys()].map((index) => (
                <div key={index}>
                  <SkeletonCustom>
                    <Skeleton.Image active />
                    <Skeleton.Input
                      active
                      size="small"
                      className="w-full pt-4"
                    />
                  </SkeletonCustom>
                </div>
              ))}
            </Slider>
          ) : (
            <Slider {...settings} className="w-full relative">
              {products.map((product) => (
                <Link
                  href={`/category/${convertSLugUrl(product.name)}-${product.id}.html`}
                  className="slide-content pr-8"
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
                      <p className="text-lg font-medium h-20">
                        {product.name}
                      </p>
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
            </Slider>
          )}
        </StyledSlider>
      </div>
    </div>
  );
};

export default DefaultSlide;
