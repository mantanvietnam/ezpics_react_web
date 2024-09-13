"use client";

import {
  SampleNextArrow,
  SamplePrevArrow,
  SkeletonCustom,
  StyledSlider,
} from "@/components/Slide/CustomSlide";
import TruncatedText from "@/components/TruncatedText";
import { getProductCategoryAPI } from "@/api/product";
import { getCookie } from "@/utils";
import { convertSLugUrl } from "@/utils/url";
import { Skeleton, Slider } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Page({ params }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Page state
  const limit = 24; // Items per page
  const observer = useRef(); // Ref for IntersectionObserver
  const [categoryName, setCategoryName] = useState("");

  const slug = params?.detailCategory?.split(".html")?.[0];
  const temp = slug?.split("-");
  const id = temp[temp.length - 1];

  useEffect(() => {
    const name = getNameCategory();
    setCategoryName(name);
  }, [])


  const getNameCategory = async () => {
    try {
      const response = await getProductCategoryAPI();

      if (!response) {
        throw new Error("No listData found in the API response.");
      }

      const category = response.listData.find((item) => item.id == id);

      if (!category) {
        throw new Error(`No category found with ID ${id}`);
      }
      return category.name;
    } catch (error) {
      console.log(error)
    }
  }

  const { data: session } = useSession();
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://apis.ezpics.vn/apis/getProductByCategoryAPI",
          {
            category_id: id,
            limit: limit,
            page: page,
          }
        );
        setCategories((prevCategories) => [
          ...prevCategories,
          ...response.data.listData,
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchArticle();
  }, [id, page]);

  // IntersectionObserver callback
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver);
    const loadMoreRef = document.querySelector("#load-more-ref");
    if (loadMoreRef) {
      observer.current.observe(loadMoreRef);
    }
    return () => {
      if (observer.current && loadMoreRef) {
        observer.current.unobserve(loadMoreRef);
      }
    };
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 items per row
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
    <div className="w-[100%] mx-auto pt-4">
      <h1 className="text-2xl font-bold">{categoryName}</h1>
      <div>
        <StyledSlider>
          {loading && page === 1 ? (
            <Slider {...settings} className="w-full relative">
              {[...Array(4).keys()].map((index) => (
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
            <div className="grid grid-cols-4 grid-flow-row gap-4">
              {categories?.map((category) => (
                <Link
                  href={`/category/${convertSLugUrl(category.name)}-${category.id
                    }.html`}
                  className="slide-content py-2"
                  key={category.id}
                >
                  <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
                    <div className="bg-orange-100 overflow-hidden group flex justify-center">
                      <Image
                        src={category.image}
                        width={300}
                        height={200}
                        className="object-contain h-48 w-96 transition-transform duration-300 ease-in-out group-hover:scale-110"
                        alt={category.name}
                      />
                    </div>
                    <div className="p-2">
                      <h2 className="text-lg font-medium h-12 mobile:h-20">
                        <TruncatedText text={category.name} maxLength={33} />
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm">
                        Đã bán {category.sold}
                      </p>
                      <div className="mt-2">
                        <span className="text-red-500 mr-2 font-bold text-lg">
                          {category.sale_price === 0 ||
                            (dataInforUser?.member_pro === 1 &&
                              category?.free_pro)
                            ? "Miễn phí"
                            : VND.format(category.sale_price)}
                        </span>
                        <span className="text-gray-500 line-through">
                          {category?.price === 0
                            ? ""
                            : VND.format(category?.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div id="load-more-ref" className="h-1 w-full"></div>
            </div>
          )}
        </StyledSlider>
      </div>
    </div>
  );
}
