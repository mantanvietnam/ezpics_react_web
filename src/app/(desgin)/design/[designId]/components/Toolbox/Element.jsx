/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAppSelector } from "@/hooks/hook";
import {
  addLayerImage,
  updatePageLayer,
} from "@/redux/slices/editor/stageSlice";
import { addLayerImageUrlAPI } from "@/api/design";
import { useDispatch, useSelector } from "react-redux";
import "@/styles/newloading.css";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

function checkTokenCookie() {
  const allCookies = document.cookie.split("; ");
  const tokenCookie = allCookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1].replace(/^"|"$/g, "") : null;
}

export default function Graphic() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const network = useAppSelector((state) => state.network.ipv4Address);
  const stageData = useSelector((state) => state.stage.stageData);
  const { currentPage } = stageData;
  const dispatch = useDispatch();
  const searchTimeoutRef = useRef(null); // for debouncing

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${network}/categoryIngredientAPI`);
        setCategories(response.data.data);
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
      setFilteredItems(allItems);
      setLoading(false);
    }

    fetchCategories();
    fetchAllItems();
  }, [network]);

  const handleImage = async (item) => {
    try {
      const res = await addLayerImageUrlAPI({
        idproduct: stageData.design.id,
        token: checkTokenCookie(),
        imageUrl: item.image,
        page: currentPage.page,
      });
      dispatch(addLayerImage(res.data));
      dispatch(updatePageLayer(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (term) {
        const filtered = items.filter((item) =>
          item.keyword?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems(items); // Reset to all items if search is cleared
      }
    }, 500); // Delay search by 500ms
  };

  return (
    <div
      className="absolute top-0 left-[108px] h-full w-[300px] pb-[65px] overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center font-semibold justify-between px-4">
          <h4 className="font-sans text-xl py-2">Thành phần</h4>
        </div>

        <div className="mb-2 px-4 relative">
          <FaSearch className="absolute left-7 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thành phần ..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border border-gray-300 rounded"
          />
        </div>

        <div className="px-4">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              title={category.name}
              categoryId={category.id}
              items={filteredItems}
              handleImage={handleImage}
              loading={loading}
            />
          ))}
        </div>
      </div>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            position: "absolute",
            zIndex: 20000000000,
            top: "-50px",
          }}
        >
          <div className="loadingio-spinner-dual-ring-hz44svgc0ld2">
            <div className="ldio-4qpid53rus92">
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
            <Image
              style={{
                position: "absolute",
                top: 30,
                left: 32,
                width: 40,
                height: 40,
                zIndex: 999999,
              }}
              alt=""
              width={50}
              height={50}
              src="/images/EZPICS.png"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, categoryId, items, handleImage, loading }) {
  const containerRef = useRef(null);
  const filteredItems = items.filter((item) => item.category_id === categoryId);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div>
      {loading ? (
        <div></div>
      ) : filteredItems.length === 0 ? (
        <div>
          <div className="flex justify-between items-center py-2.5">
            <h4 className="font-sans font-semibold">{title}</h4>
          </div>
          <div className="py-2 text-red-700 text-center">
            Chưa có thành phần phù hợp
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center py-2.5">
            <h4 className="font-sans font-semibold">{title}</h4>
          </div>

          {/* Pagination buttons */}
          <div className="relative flex items-center">
            <button
              className="absolute left-[-20px] z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-200"
              onClick={scrollLeft}
            >
              &lt;
            </button>
            <div
              ref={containerRef}
              className="flex overflow-x-auto gap-2 scrollbar-hidden"
            >
              {filteredItems.map((item, index) => (
                <ImageItem
                  key={index}
                  preview={item.image}
                  onClick={() => handleImage(item)}
                />
              ))}
            </div>
            <button
              className="absolute right-[-20px] z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-200"
              onClick={scrollRight}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageItem({ preview, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative bg-gray-100 cursor-pointer rounded-lg overflow-hidden max-h-56"
      style={{ minWidth: "130px", minHeight: "100px" }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-gradient-to-b from-transparent to-black/45"></div>
      <img src={preview} alt="" className="w-full h-full object-contain" />
    </div>
  );
}
