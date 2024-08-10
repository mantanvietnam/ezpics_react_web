"use client";
import React, { useEffect, useRef, useState } from "react";
import { getMyProductApi } from "@/api/product";
import DefaultPage from "@/components/YourProduct/DefaultPage";
import { checkTokenCookie } from "@/utils/cookie";
import { Spin } from "antd";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef(null);

  const searchValue = {
    token: checkTokenCookie(),
    limit: 20,
    page: page,
    name: searchTerm,
    type: "user_create",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getMyProductApi(searchValue);
        if (response?.listData?.length === 0) {
          setHasMore(false); // No more products to load
        } else {
          setProducts((prevProducts) => {
            if (page === 1) {
              // For the first page, replace products array
              return response.listData;
            } else {
              // Append products for subsequent pages
              return [...prevProducts, ...response.listData];
            }
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchTerm]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    const target = document.querySelector('#loadMoreTrigger');
    if (target) observer.current.observe(target);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore, loading]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    setProducts([]);
    setHasMore(true);
  };

  return (
    <>
      <div className="w-full mobile:w-1/3 pt-1 flex items-center gap-2 mb-5">
        <input
          placeholder="Tìm kiếm ..."
          type="text"
          style={{
            backgroundColor: "#fff",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            borderRadius: "4px",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            outline: "none",
          }}
          className="w-[60%] h-[40px] p-3"
          onChange={handleSearchChange}
        />
      </div>
      <DefaultPage getData={products} searchValue={searchValue} />
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <Spin size="large" />
        </div>
      )}
      <div id="loadMoreTrigger" style={{ height: "1px" }}></div>
    </>
  );
}
