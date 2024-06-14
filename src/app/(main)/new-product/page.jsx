'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Page() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [sortOption, setSortOption] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filterOption, setFilterOption] = useState('');

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit({ sortOption, filterOption });
        toggleDrawer();
    };

    const handleCancel = () => {
        setSortOption('');
        setFilterOption('');
        toggleDrawer();
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const onSubmit = async ({ sortOption, filterOption }) => {
        try {
            let url = 'https://apis.ezpics.vn/apis/getProductAllCategoryAPI';
            let params = {};
            if (selectedCategory) {
                params.category = selectedCategory;
            }
            if (filterOption) {
                params.filter = filterOption;
            }
            if (sortOption) {
                params.sort = sortOption;
            }
            const response = await axios.get(url, { params });
            if (response?.data?.listData) {
                setProducts(response.data.listData[0]?.listData);
            } else {
                console.error("Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
        }
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get('https://apis.ezpics.vn/apis/getProductCategoryAPI');
                if (response?.data?.listData) {
                    setCategories(response.data.listData);
                } else {
                    console.error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching categories:", error.message);
            }
        };
        getCategories();
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                let url = 'https://apis.ezpics.vn/apis/getProductAllCategoryAPI';
                if (selectedCategory) {
                    url += `?category=${selectedCategory}`;
                }
                const response = await axios.get(url);
                if (response?.data?.listData) {
                    setProducts(response.data.listData[0]?.listData);
                } else {
                    console.error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching products:", error.message);
            }
        };
        getProducts();
    }, [selectedCategory]);

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

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id === selectedCategory)
        : products;

    // Calculate the current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortItems(filteredProducts.slice(indexOfFirstItem, indexOfLastItem), sortOption);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="p-6">
            {/* Header */}
            <h1 className="text-2xl font-semibold mb-6">Thiết kế mới trong tuần</h1>

            {/* Search Bar and Drawer */}
            <div className="flex justify-between items-center mb-6">
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="p-2 border rounded-md"
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={toggleDrawer}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Tìm kiếm nâng cao
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
                            <div className="flex flex-col space-y-2">
                                <label>
                                    <input
                                        type="radio"
                                        value="priceAsc"
                                        checked={sortOption === 'priceAsc'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Giá tăng dần
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="priceDesc"
                                        checked={sortOption === 'priceDesc'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Giá giảm dần
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="createdAt"
                                        checked={sortOption === 'createdAt'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Theo thời gian tạo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="likes"
                                        checked={sortOption === 'likes'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Yêu thích
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="views"
                                        checked={sortOption === 'views'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Lượt xem
                                </label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Lọc theo</label>
                            <div className="flex flex-col space-y-2">
                                <label>
                                    <input
                                        type="radio"
                                        value=""
                                        checked={filterOption === ''}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Không
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="price"
                                        checked={filterOption === 'price'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Sắp xếp theo giá
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="createdAt"
                                        checked={filterOption === 'createdAt'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Thời gian tạo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="views"
                                        checked={filterOption === 'views'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Lượt xem
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="likes"
                                        checked={filterOption === 'likes'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Lượt yêu thích
                                </label>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white p-2 rounded-md"
                            >
                                Gửi
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white p-2 rounded-md"
                            >
                                Hủy
                            </button>
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
                        className={`mx-1 px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
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
