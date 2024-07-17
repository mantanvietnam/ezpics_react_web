"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";

function checkTokenCookie() {
  const allCookies = document.cookie.split("; ");
  const tokenCookie = allCookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1].replace(/^"|"$/g, "") : null;
}

export default function Graphic() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${network}/categoryIngredientAPI`);
        setCategories(response.data.data);
        console.log("Fetched categories:", response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function fetchAllItems() {
      let allItems = [];
      let page = 1;
      let hasMoreData = true;

      while (hasMoreData) {
        try {
          const response = await axios.post(`${network}/listIngredientAPI`, {
            token: checkTokenCookie(),
            limit: 100,
            page: page,
          });
          const fetchedItems = response.data.data;
          console.log("Fetched items:", fetchedItems);
          if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
            allItems = [...allItems, ...fetchedItems];
            page++;
          } else {
            hasMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching items:", error);
          hasMoreData = false;
        }
      }

      setItems(allItems);
      setLoading(false);
    }

    fetchCategories();
    fetchAllItems();
  }, [network]);

  const handleImage = async (item) => {
    try {
      const response = await axios.post(`${network}/addLayerImageUrlAPI`, {
        idproduct: idProduct,
        token: checkTokenCookie(),
        imageUrl: item.image,
        page: parseGraphicJSON(),
      });
      if (response.data.code === 1) {
        const content = response.data.data.content;
        console.log("Image handled:", content);
      }
    } catch (error) {
      console.error("Error handling image:", error);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="absolute top-0 left-[100px] h-full w-[300px] border-r border-gray-300 overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center font-semibold justify-between px-6">
          <h4 className="font-sans">Thành phần</h4>
          <div className="cursor-pointer flex"></div>
        </div>
        <div className="px-6">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              title={category.name}
              categoryId={category.id}
              items={items}
              handleImage={handleImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ title, categoryId, items, handleImage }) {
  const [showAll, setShowAll] = useState(false);
  const filteredItems = items.filter((item) => item.category_id === categoryId);
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center py-2.5">
        <h4 className="font-sans">{title}</h4>
        <button
          className="border-0 bg-white text-blue-700 cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
      <div className="grid gap-2 grid-cols-2">
        {console.log(displayItems)}
        {displayItems.map((item, index) => (
          <ImageItem
            key={index}
            preview={item.image}
            onClick={() => handleImage(item)}
          />
        ))}
      </div>
    </div>
  );
}

function ImageItem({ preview, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative bg-gray-100 cursor-pointer rounded-lg overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-gradient-to-b from-transparent to-black/45"></div>
      <img src={preview} className="w-full h-full object-contain" />
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="w-full h-full bg-black/70 absolute z-[20000000000]">
      <div className="loadingio-spinner-dual-ring-hz44svgc0ld">
        <div className="ldio-4qpid53rus9">
          <div></div>
          <div>
            <div></div>
          </div>
        </div>
        {/* <Image
          style={{ position: "absolute", top: "12%", left: "16%" }}
          height={40}
          width={40}
          src={ezlogo}
          alt=""
        /> */}
      </div>
    </div>
  );
}