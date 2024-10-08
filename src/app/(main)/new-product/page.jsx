"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SkeletonCustom } from "@/components/Slide/CustomSlide";
import Image from "next/image";
import { DateTime } from "luxon";
import { searchProductAPI } from "@/api/product";
import Link from "next/link";
import { Spin, Flex } from "antd";
import { ControlOutlined } from "@ant-design/icons";
import { checkTokenCookie } from "@/utils";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { convertSLugUrl } from "../../../utils/url";

function Page() {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dataInforUser, setdataInforUser] = useState(null);
  const limit = 20;

  const searchValue = {
    limit: limit,
    page: currentPage,
    name: "",
    price: "",
    orderBy: filterOption != "" ? filterOption : "create",
    orderType: sortOption != "" ? sortOption : "desc",
    category_id: selectedCategory != "" ? selectedCategory : "",
    color: "",
  };
  const cookie = checkTokenCookie();
  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await axios.post(
          "https://apis.ezpics.vn/apis/getInfoMemberAPI",
          {
            token: cookie,
          }
        );

        if (response) {
          // console.log('response',response?.data?.data);
          setdataInforUser(response?.data?.data);
        } else {
          console.error("Invalid response format for categories");
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchDataUser();
  }, [cookie]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://apis.ezpics.vn/apis/getProductCategoryAPI"
        );
        if (response?.data?.listData) {
          setCategories(response.data.listData);
        } else {
          console.error("Invalid response format for categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true)
      try {
        const response = await searchProductAPI(searchValue);
        setLoading(false);
        if (response.listData.length === 0) {
          setHasMore(false); // No more products to load
        } else {
          setProducts((prevProducts) => [
            ...prevProducts,
            ...response.listData,
          ]);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, filterOption, sortOption, currentPage, searchValue]);

  const handleCategoryChange = (event) => {
    setProducts([]);
    // setProductsFilter([]);
    setCurrentPage(1);
    setHasMore(true);
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setProducts([]);
    // setProductsFilter([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
    setProducts([]);
    // setProductsFilter([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleCancel = () => {
    setSortOption("");
    setFilterOption("");
    toggleDrawer();
    setClosing(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSubmit = () => {
    toggleDrawer();
  };
  const showModal = () => {
    setIsModalOpen(true);
    setClosing(false); // Reset trạng thái khi mở modal
  };

  const handleOk = () => {
    setClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500); // Thời gian trễ phải trùng với thời gian của animation
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }
    setLoadingMore(true);
    setCurrentPage((prevPage) => prevPage + 1);
    // setLoadingMore(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, handleScroll]);

  useEffect(() => {
    if (loadingMore) {
      const fetchData = async () => {
        try {
          const response = await searchProductAPI(searchValue);
          if (response.listData.length === 0) {
            setHasMore(false);
          } else {
            setProducts((prevProducts) => [
              ...prevProducts,
              ...response.listData,
            ]);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingMore(false);
        }
      };
      fetchData();
    }
  }, [loadingMore, searchValue]);

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  // console.log(products);

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="w-full text-start">
        <h1 className="text-2xl font-semibold mb-6 w-full">
          Thiết kế mới trong tuần
        </h1>
        {/* Search Bar and Drawer */}
        <div className="flex justify-start items-center mb-6 w-full">
          <div className="flex items-start gap-3">
            <button
              onClick={toggleDrawer}
              className="h-10 bg-blue-500 text-white px-4 rounded-md flex items-center gap-2"
            >
              <ControlOutlined />
              <span>Nâng cao</span>
            </button>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-2 border rounded-md"
            >
              <option value="">Chọn danh mục</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-64 p-4 shadow-lg">
            <button
              onClick={toggleDrawer}
              className="text-red-500 font-semibold mb-4"
            >
              Close
            </button>
            <h3 className="font-bold mb-2">Tìm kiếm nâng cao</h3>
            <div className="mb-4">
              <label className="block mb-2">Lọc theo</label>
              <div className="flex flex-col space-y-2">
                <label>
                  <input
                    type="radio"
                    value=""
                    checked={filterOption === ""}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Tất cả
                </label>
                <label>
                  <input
                    type="radio"
                    value="price"
                    checked={filterOption === "price"}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Giá
                </label>
                <label>
                  <input
                    type="radio"
                    value="create"
                    checked={filterOption === "create"}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Thời gian tạo
                </label>
                <label>
                  <input
                    type="radio"
                    value="view"
                    checked={filterOption === "view"}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Lượt xem
                </label>
                <label>
                  <input
                    type="radio"
                    value="favorite"
                    checked={filterOption === "favorite"}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Lượt yêu thích
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Sắp xếp theo</label>
              <div className="flex flex-col space-y-2">
                <label>
                  <input
                    type="radio"
                    value="asc"
                    checked={sortOption === "asc"}
                    onChange={handleSortChange}
                    className="mr-2"
                  />
                  Tăng dần
                </label>
                <label>
                  <input
                    type="radio"
                    value="desc"
                    checked={sortOption === "desc"}
                    onChange={handleSortChange}
                    className="mr-2"
                  />
                  Giảm dần
                </label>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white p-2 rounded-md"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
          <div
            className="flex-1 bg-gray-600 bg-opacity-50"
            onClick={toggleDrawer}
          ></div>
        </div>
      )}

      {/* Loading spinner */}
      {loading ? (
        <div className=" w-full">
          <Flex
            align="center"
            gap="middle"
            className="flex justify-center items-center"
          >
            {/* Placeholder for loading spinner */}
          </Flex>
        </div>
      ) : (
        <>
          {/* Products */}
          {products.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 sm:gap-3 gap-3 justify-center">
                {products.map((item, index) => (
                  <div className="block" key={index}>
                    <Link
                      href={`/category/${convertSLugUrl(item.name)}-${
                        item.id
                      }.html`}
                      key={item.id}
                    >
                      <div className="card bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-orange-100 overflow-hidden text-center">
                          <Image
                            src={item.image}
                            width={300}
                            height={200}
                            className="object-contain h-48 w-full"
                            alt={item.name}
                          />
                        </div>

                        <div className="p-4">
                          <h2 className="text-lg font-medium h-20 line-clamp-3">
                            {item.name}
                          </h2>
                          <p className="text-gray-500 mt-2 text-sm">
                            Đã bán {item.sold}
                          </p>
                          <div className="mt-2">
                            <span className="text-red-500 mr-2 font-bold text-lg">
                              {item.sale_price === 0 ||
                              (dataInforUser?.member_pro === 1 &&
                                item?.free_pro)
                                ? "Miễn phí"
                                : VND.format(item.sale_price)}
                            </span>
                            {item.sale_price !== 0 && (
                              <span className="text-gray-500 line-through">
                                {VND.format(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="center text-center w-full">
              <Flex
                align="center"
                gap="middle"
                className="flex justify-center items-center"
              >
                {/* Placeholder for no products found */}
                <Spin size="large" />
              </Flex>
            </div>
          )}
          <ScrollToTopButton />
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="center text-center w-full">
              <Flex
                align="center"
                gap="middle"
                className="flex justify-center items-center"
              >
                {/* Placeholder for loading more spinner */}
                <Spin size="large" />
              </Flex>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
