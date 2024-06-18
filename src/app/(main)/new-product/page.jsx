'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SkeletonCustom } from '@/components/Slide/CustomSlide';
import { Skeleton } from 'antd';
import { DateTime } from 'luxon';
import { searchProductAPI } from '@/api/product';
import { Flex, Spin } from 'antd';

function Page() {
    const [categories, setCategories] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsFilter, setProductsFilter] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    console.log('selectedCategory', selectedCategory)
    const limit = 20;
    // const observer = useRef();

    const searchValue = {
        limit: limit,
        page: currentPage,
        name: '',
        price: '',
        orderBy: filterOption != '' ? filterOption : 'create',
        orderType: sortOption != '' ? sortOption : 'desc',
        category_id: selectedCategory != '' ? selectedCategory : '',
        color: ''
    }
    console.log('searchValue', searchValue)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://apis.ezpics.vn/apis/getProductCategoryAPI');
                if (response?.data?.listData) {
                    setCategories(response.data.listData);
                } else {
                    console.error("Invalid response format for categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error.message);
            }
        };
        fetchCategories()

    }, []);

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await searchProductAPI(searchValue)
                setLoading(false)
                if (response.listData.length === 0) {
                    setHasMore(false); // No more products to load
                } else {
                    setProducts((prevProducts) => [...prevProducts, ...response.listData]);
                }
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchData()
    }, [selectedCategory, filterOption, sortOption, currentPage])

    const handleCategoryChange = (event) => {
        // const filteredProducts = products.filter(p => p.category_id == event.target.value);
        // setProductsFilter(filteredProducts);
        // setSelectedCategory(event.target.value);
        // console.log(filteredProducts)
        setProducts([]);
        setProductsFilter([]);
        setCurrentPage(1);
        setHasMore(true);
        setSelectedCategory(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setProducts([]);
        setProductsFilter([]);
        setCurrentPage(1);
        setHasMore(true);
        // setSortOption(event.target.value);
        // sortItems(products,)
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
        setProducts([]);
        setProductsFilter([]);
        setCurrentPage(1);
        setHasMore(true);
        // setFilterOption(event.target.value);
    };


    console.log('filterOption', filterOption)
    console.log('sortOption', sortOption)
    const handleSubmit = () => {
        toggleDrawer();
    };

    const handleCancel = () => {
        setSortOption('');
        setFilterOption('');
        toggleDrawer();
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore || !hasMore) {
            return;
        }
        setLoadingMore(true);
        setCurrentPage((prevPage) => prevPage + 1);
        // setLoadingMore(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore]);


    useEffect(() => {
        if (loadingMore) {
            const fetchData = async () => {
                try {
                    const response = await searchProductAPI(searchValue);
                    if (response.listData.length === 0) {
                        setHasMore(false);
                    } else {
                        setProducts((prevProducts) => [...prevProducts, ...response.listData]);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoadingMore(false);
                }
            };
            fetchData();
        }
    }, [loadingMore]);
    function momartprice(a) {

        switch (a) {
            case a.price:
                break;
            default:
                break;
        }

    }

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
                    {categories?.map(category => (
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
                <div className="fixed inset-0 z-50 flex ">
                    <div className="bg-white w-64 p-4 shadow-lg ">
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
                                        checked={filterOption === ''}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Tất cả
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="price"
                                        checked={filterOption === 'price'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Giá
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="create"
                                        checked={filterOption === 'create'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Thời gian tạo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="view"
                                        checked={filterOption === 'view'}
                                        onChange={handleFilterChange}
                                        className="mr-2"
                                    />
                                    Lượt xem
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="favorite"
                                        checked={filterOption === 'favorite'}
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
                                        checked={sortOption === 'asc'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Tăng dần
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="desc"
                                        checked={sortOption === 'desc'}
                                        onChange={handleSortChange}
                                        className="mr-2"
                                    />
                                    Giảm dần
                                </label>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            {/* <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white p-2 rounded-md"
                            >
                                Gửi
                            </button> */}
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
                <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5 mb-10'>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <SkeletonCustom key={index}>
                            <Skeleton.Image active />
                            <Skeleton.Input active size="small" className="w-full pt-4" />
                        </SkeletonCustom>
                    ))}
                </div>
            ) : (
                <>
                    {/* Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productsFilter.length > 0 ? (
                            <>
                                {productsFilter?.map((item) => (
                                    <div key={item?.id} className="bg-white rounded-md shadow-md p-4">
                                        <img
                                            src={item?.image}
                                            alt={item?.name}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <p className="mt-2 text-lg font-medium">{item?.name}</p>
                                        <p className="mt-1 text-gray-500">Đã bán {item?.sold}</p>
                                        <p className="font-semibold mt-2 text-lg text-red-500">
                                            <span className="mr-2">{item?.sale_price === '0' ? 'Miễn phí' : item?.sale_price}₫</span>
                                            <del className="text-gray-500">{item?.price}₫</del>
                                        </p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {products?.map((item) => (
                                    <div key={item?.id} className="bg-white rounded-md shadow-md p-4">
                                        <img
                                            src={item?.image}
                                            alt={item?.name}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <p className="mt-2 text-lg font-medium">{item?.name}</p>
                                        <p className="mt-1 text-gray-500">Đã bán {item?.sold}</p>
                                        <p className="font-semibold mt-2 text-lg text-red-500">
                                            <span className="mr-2">{item?.sale_price == 0 ? 'Miễn phí' : `${item?.sale_price}₫`}</span>
                                            <del className="text-gray-500">{item?.price == 0 ? ''  :`${item?.price}₫`}</del>
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Loading more indicator */}
                    {loadingMore && (
                        <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5 mb-10'>
                            {Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonCustom key={index}>
                                    <Skeleton.Image active />
                                    <Skeleton.Input active size="small" className="w-full pt-4" />
                                </SkeletonCustom>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Page;
