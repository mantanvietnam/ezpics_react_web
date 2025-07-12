import React from "react";
import { useEffect, useRef, useState } from "react";
import { ConfigProvider, Popover, Spin } from "antd";
import { useDebounce } from "@/hooks";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { convertSLugUrl } from "../utils/url";

function Search({ searchAPI, searchParams, placeholder }) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const debounced = useDebounce(searchValue, 500);
  const inputRef = useRef();
  const containerRef = useRef();
  const router = useRouter();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Chuyển hướng đến trang /dashboard-search với giá trị tìm kiếm
      router.push(`/dashboard-search/${searchValue}`);
    }
  };

  useEffect(() => {
    if (!debounced) {
      setSearchResult([]);
      setPopoverVisible(false);
      setIsLoading(false);
      return;
    }

    const fetchApi = async () => {
      try {
        setIsLoading(true);
        setPopoverVisible(true); // Hiển thị popover ngay khi bắt đầu loading
        const result = await searchAPI({
          name: debounced,
          ...searchParams,
        });
        setSearchResult(result.listData || result.data || []);
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setPopoverVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApi();
  }, [debounced, searchAPI, searchParams]);

  useEffect(() => {
    if (containerRef.current) {
      setInputWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current?.offsetWidth]);

  const content = (attrs) => {
    return (
      <div
        className="bg-white text-lg rounded-lg"
        tabIndex="-1"
        {...attrs}
        style={{ width: inputWidth }}>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />}
              className="mr-2"
            />
            <span className="text-gray-500">Đang tìm kiếm...</span>
          </div>
        ) : (
          <>
            {searchResult.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                href={`/category/${convertSLugUrl(item.title)}-${item.id}.html`}
                className="flex items-center w-full p-2 hover:bg-gray-200">
                <Image
                  src={item.image || item.thumbnail}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="mr-4 w-11 h-10"
                />
                <span>{item.name}</span>
              </Link>
            ))}
            {searchResult.length > 0 && (
              <Link
                href={`/dashboard-search/${debounced}`}
                className="flex items-center justify-center text-red-500 cursor-pointer mt-2">
                Xem thêm
              </Link>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <ConfigProvider>
      <div className="flex justify-center w-full">
        <div className="relative w-full mobile:w-3/5" ref={containerRef}>
          <Popover
            content={content}
            trigger="click"
            className="w-full"
            placement="bottomLeft"
            open={popoverVisible}>
            <div className="relative flex items-center h-12 p-4 rounded-lg shadow-sm border bg-white w-full">
              <SearchOutlined className="text-lg text-gray-500" />
              <input
                className="ml-2 py-2 w-full h-full bg-transparent outline-none"
                ref={inputRef}
                value={searchValue}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Tìm kiếm nội dung"}
                spellCheck={false}
                onChange={(e) => setSearchValue(e.target.value.trimStart())}
              />
            </div>
          </Popover>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Search;
