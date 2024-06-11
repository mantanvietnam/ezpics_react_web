import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Popover } from 'antd';
import { useDebounce } from '@/hooks';
import { searchProductAPI } from '@/api/product';
import { SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const debounced = useDebounce(searchValue, 500);
    const inputRef = useRef();

    useEffect(() => {
        if (!debounced) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            try {
                const result = await searchProductAPI({
                    name: debounced,
                    limit: 12,
                    page: 1,
                    // orderBy: 'price',
                    // orderType: 'desc'
                });
                setSearchResult(result.listData || []);
            } catch (error) {
                console.error('Failed to fetch search results', error);
            }
        };

        fetchApi();
    }, [debounced]);

    const content = (attrs) => {
        return (
            <div className="bg-white text-lg rounded-lg" tabIndex="-1" {...attrs}>
                {searchResult.slice(0,4).map((item, index) => (
                    <div key={index} className="flex items-center w-full p-2 hover:bg-gray-200">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="mr-4 w-11 h-10"
                        />
                        <span>{item.name}</span>
                    </div>
                ))}
                <div className="text-center text-red-500 cursor-pointer mt-2">Xem thêm</div>
            </div>
        );
    };

    return (
        <ConfigProvider>
            <Popover
                content={content}
                overlayInnerStyle={{width: "745px"}}
                trigger="click"
                className="w-4/5"
                placement="bottomLeft"
            >
                <div className="relative flex items-center h-12 p-4 rounded-lg shadow-sm border bg-white">
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
        </ConfigProvider>
    );
}

export default Search;
