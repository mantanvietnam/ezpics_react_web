"use client";
import { getNewProducts } from "@/lib/actions/actions";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, background: "rgba(0, 0, 0, 0.5)", color: "#fff" }}
      onClick={onClick}
    />
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
    <div className="container">
      <h1>New Products</h1>
      <div className="slider-container">
        <Slider {...settings}>
          {listNewProducts.map((product) => (
            <div className="slide-item" key={product.id}>
              <Image
                key={product.id}
                src={product.image}
                width={150}
                height={100}
                className="slide-img rounded-lg cursor-pointer"
              />
              <h2>{product.name}</h2>
              <p>Đã bán {product.sold}</p>
              <p>
                {product.sale_price} / {product.price}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default listNewProducts;
