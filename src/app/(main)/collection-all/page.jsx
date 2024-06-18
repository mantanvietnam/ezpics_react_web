"use client";
import { searchWarehousesAPI } from "@/api/product";
import Collection from "@/components/Collection";
import Search from "@/components/Search";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await searchWarehousesAPI({ limit: 40, page: 1 });
        setCollections(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, []);
  return (
    <div className="flex-col w-[90%] mt-5">
      {/* Banner */}
      <div
        style={{
          background: "rgb(231, 246, 246)",
        }}
        className="flex items-center justify-around gap-8 p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]">
        <div className="flex flex-col gap-5">
          <div className="text-[32px] font-bold">
            Biến mỗi khoảnh khắc thành nghệ thuật
          </div>
          <div>
            Ezpics Collection - Tạo nên bộ sưu tập ảnh độc đáo, làm nổi bật câu
            chuyện của bạn.
          </div>
        </div>
        <div className="w-[300px] h-[300px]">
          <img src="/images/hobby.png" alt="hobby" />
        </div>
      </div>
      {/* searchButton */}
      <div className="w-[50%] mt-5">
        <Search
          searchAPI={searchWarehousesAPI}
          searchParams={{
            limit: 40,
            page: 1,
          }}
        />
      </div>
      {/* list product */}
      <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-5">
        {collections.map((collection) => (
          <div key={collection.id} className="flex justify-center items-center">
            <Collection collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
}
