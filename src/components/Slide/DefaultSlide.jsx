"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { StyledSlider, SampleNextArrow, SamplePrevArrow } from "./CustomSlide";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const DefaultSlide = ({ apiAction, title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiAction();
      setProducts(response.listData);
      console.log(response);
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
    <div className="w-5/6 mx-auto px-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div>
        <StyledSlider>
          <Slider {...settings} className="w-full relative">
            {products.map((product) => (
              <div className="slide-content pr-8" key={product.id}>
                <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
                  <div className="bg-orange-100">
                    <Image
                      src={product.image}
                      width={300}
                      height={200}
                      className="object-contain h-48 w-96"
                      alt={product.name}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium h-20">{product.name}</h2>
                    <p className="text-gray-500 mt-2">Đã bán {product.sold}</p>
                    <div className="mt-2">
                      <span className="text-red-500 font-bold mr-2">
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
              </div>
            ))}
          </Slider>
        </StyledSlider>
      </div>
    </div>
  );
};

export default DefaultSlide;
