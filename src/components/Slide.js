"use client";
import { getNewProducts } from "@/lib/actions/actions";
import Image from "next/image";
import styled from "styled-components";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const StyledSlider = styled.div`
  .slick-prev:before,
  .slick-next:before {
    content: none; /* Remove default arrow content */
  }

  .slick-prev,
  .slick-next {
    display: none; /* Hide default arrow elements */
  }
`;

const Arrow = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;

  &.next {
    right: 10px;
  }

  &.prev {
    left: 10px;
  }

  &:hover,
  &:active {
    background: #000;
    color: #fff;
  }
`;

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow className={`${className} next`} style={style} onClick={onClick}>
      <FaArrowRight size={20} />
    </Arrow>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow className={`${className} prev`} style={style} onClick={onClick}>
      <FaArrowLeft size={20} />
    </Arrow>
  );
}

const listNewProducts = async () => {
  const products = await getNewProducts();
  const listNewProducts = products.listData;
  console.log(listNewProducts[1].id);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="container mx-auto px-5">
      <h1 className="text-2xl font-bold mb-4">New Products</h1>
      <div>
        <StyledSlider>
          <Slider {...settings} className="w-full cursor-pointer">
            {listNewProducts.map((product) => (
              <div>
                <div
                  className="card bg-white rounded-lg shadow-md overflow-hidden w-60"
                  key={product.id}>
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
                        {product.sale_price} ₫
                      </span>
                      <span className="text-gray-500 line-through">
                        {product.price} ₫
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

export default listNewProducts;
