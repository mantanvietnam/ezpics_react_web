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
import { Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const observer = useRef();
  const loadingRef = useRef(false);

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
    const fetchData = async (currentPage) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const response = await getNewProducts({ page: currentPage, limit });
        if (response.listData.length > 0) {
          setCategories((prev) => [...prev, ...response.listData]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasMore(false);
      } finally {
        loadingRef.current = false; // Đánh dấu không còn loading
        setLoading(false);
      }
    };

    fetchData(page);
  }, [page]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore && !loading) {
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
  }, [hasMore, loading]);

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
            <Skeleton active paragraph={{ rows: 4 }} />
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
              {hasMore && <div id="load-more-ref" className="w-full h-1"></div>}
            </div>
          )}
        </StyledSlider>
      </div>
    </div>
  );
}
