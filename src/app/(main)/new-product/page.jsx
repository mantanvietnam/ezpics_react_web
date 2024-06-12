// designs.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Page() {
    const [dataCategorySearch, setDataCategorySearch] = useState([]);
    const [dataConvert, setDataConvert] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('');

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        const getDataCategory = async () => {
            try {
                const response = await axios.get('https://apis.ezpics.vn/apis/getProductAllCategoryAPI');
                if (response?.data?.listData) {
                    setDataConvert(response.data.listData[0]?.listData);
                } else {
                    console.error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        getDataCategory();
    }, []);

    useEffect(() => {
        const getDataCategory = async () => {
            try {
                const response = await axios.get('https://apis.ezpics.vn/apis/getProductCategoryAPI');
                if (response?.data?.listData) {
                    setDataCategorySearch(response.data.listData);
                } else {
                    console.error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        getDataCategory();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const sortItems = (items, option) => {
        switch (option) {
            case 'priceAsc':
                return items.sort((a, b) => a.sale_price - b.sale_price);
            case 'priceDesc':
                return items.sort((a, b) => b.sale_price - a.sale_price);
            case 'createdAt':
                return items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'likes':
                return items.sort((a, b) => b.likes - a.likes);
            case 'views':
                return items.sort((a, b) => b.views - a.views);
            default:
                return items;
        }
    };

    // Calculate the current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortItems(dataConvert.slice(indexOfFirstItem, indexOfLastItem), sortOption);
    const totalPages = Math.ceil(dataConvert.length / itemsPerPage);

    return (
        <div className="p-6">
            {/* Header */}
            <h1 className="text-2xl font-semibold mb-6">Thiết kế mới trong tuần</h1>

            {/* Search Bar and Drawer */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={toggleDrawer} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                   Tùy chọn nâng cao
                </button>
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
                            <label className="block mb-2">Sắp xếp theo</label>
                            <select
                                value={sortOption}
                                onChange={handleSortChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Chọn tùy chọn sắp xếp</option>
                                <option value="priceAsc">Giá tăng dần</option>
                                <option value="priceDesc">Giá giảm dần</option>
                                <option value="createdAt">Theo thời gian tạo</option>
                                <option value="likes">Yêu thích</option>
                                <option value="views">Lượt xem</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Lọc theo</label>
                            <select
                                value={filterOption}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Chọn tùy chọn lọc</option>
                                <option value="price">Giá</option>
                                <option value="createdAt">Thời gian tạo</option>
                                <option value="views">Lượt xem</option>
                                <option value="likes">Yêu thích</option>
                            </select>
                        </div>
                    </div>
                    <div 
                        className="flex-1 bg-gray-600 bg-opacity-50" 
                        onClick={toggleDrawer}
                    ></div>
                </div>
            )}

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-md shadow-md p-4">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <p className="mt-2 text-lg font-medium">{item.name}</p>
                        <p className="mt-1 text-gray-500">Đã bán {item.sold}</p>
                        <p className="font-semibold mt-2 text-lg text-red-500">
                            <span className="mr-2">{item.sale_price}₫</span>
                            <del className="text-gray-500">{item.price}₫</del>
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-4 py-2 border rounded-md ${
                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Page;
