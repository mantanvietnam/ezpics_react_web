"use client";

import {
  SampleNextArrow,
  SamplePrevArrow,
  SkeletonCustom,
  StyledSlider,
} from "@/components/Slide/CustomSlide";
import { getNewProducts } from "@/api/product";
import { convertSLugUrl } from "@/utils/url";
import TruncatedText from "@/components/TruncatedText";
import { getCookie } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Đặt false ban đầu để không loading liên tục
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const observer = useRef();
  const loadingRef = useRef(false); // Để kiểm tra trạng thái tải

  const { data: session } = useSession();
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  // API call khi lướt đến cuối trang
  const fetchData = async (currentPage) => {
    if (loadingRef.current || !hasMore) return; // Nếu đang loading hoặc không còn dữ liệu thì không gọi API
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await getNewProducts({ page: currentPage, limit });
      if (response.listData.length > 0) {
        setCategories((prev) => [...prev, ...response.listData]);
      } else {
        setHasMore(false); // Đánh dấu đã hết dữ liệu
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Observer callback, chỉ gọi API khi lướt đến cuối trang
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingRef.current) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchData(page);
    }
  }, [page]);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    const loadMoreRef = document.querySelector("#load-more-ref");
    if (loadMoreRef) {
      observer.current.observe(loadMoreRef);
    }
    return () => {
      if (observer.current && loadMoreRef) {
        observer.current.unobserve(loadMoreRef);
      }
    };
  }, [hasMore]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
      <div>
        <StyledSlider>
          {loading && page === 1 ? (
            <SkeletonCustom />
          ) : (
            <div className="grid grid-flow-row grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  href={`/category/${convertSLugUrl(category.name)}-${
                    category.id
                  }.html`}
                  className="py-2 slide-content"
                  key={category.id}
                >
                  <div className="w-full overflow-hidden bg-white rounded-lg shadow-md cursor-pointer card sm:w-58">
                    <div className="flex justify-center overflow-hidden bg-orange-100 group">
                      <Image
                        src={category.image}
                        width={300}
                        height={200}
                        className="object-contain h-48 transition-transform duration-300 ease-in-out w-96 group-hover:scale-110"
                        alt={category.name}
                      />
                    </div>
                    <div className="p-2">
                      <h2 className="h-12 text-lg font-medium mobile:h-20">
                        <TruncatedText text={category.name} maxLength={33} />
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Đã bán {category.sold}
                      </p>
                      <div className="mt-2">
                        <span className="mr-2 text-lg font-bold text-red-500">
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
              {hasMore && (
                <div
                  id="load-more-ref"
                  className="w-full h-10 flex justify-center items-center"
                >
                  {loading && (
                    <div className="fixed inset-0 flex justify-center items-center">
                      <CircularProgress size={40} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </StyledSlider>
      </div>
    </div>
  );
}
