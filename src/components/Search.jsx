import React from "react";
import { useEffect, useRef, useState } from "react";
import { ConfigProvider, Popover } from "antd";
import { useDebounce } from "@/hooks";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

function Search({ searchAPI, searchParams }) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);

  const debounced = useDebounce(searchValue, 500);
  const inputRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!debounced) {
      setSearchResult([]);
      setPopoverVisible(false);
      return;
    }
    const fetchApi = async () => {
      try {
        const result = await searchAPI({
          name: debounced,
          ...searchParams,
        });
        setSearchResult(result.listData || result.data || []);
        setPopoverVisible(true);
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setPopoverVisible(false);
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
        {searchResult.slice(0, 4).map((item, index) => (
          <Link
            key={index}
            href={`/category/${item.id}`}
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
        <Link
          href={`/dashboard-search/${debounced}`}
          className="flex items-center justify-center text-red-500 cursor-pointer mt-2">
          Xem thêm
        </Link>
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
                className="ml-2 w-full h-full bg-transparent outline-none"
                ref={inputRef}
                value={searchValue}
                placeholder="Tìm kiếm nội dung trên Ezpics"
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
