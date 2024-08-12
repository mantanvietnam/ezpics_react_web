'use client'
import React, { useEffect, useState } from 'react';
import { getDataTransaction } from "@/api/transaction";
import { checkTokenCookie } from '@/utils/cookie';
import { Flex, Spin } from 'antd';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Page = () => {
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Manage page number separately
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // Fetch data based on currentPage and limit
    const fetchData = async (page, limit) => {
        try {
            const searchValue = {
                limit,
                page,
                token: checkTokenCookie(),
            };
            const response = await getDataTransaction(searchValue);
            if (response?.listData?.length) {
                return response.listData;
            } else {
                return []; // No more data to load
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return []; // Return empty array on error
        }
    };

    // Initial data load
    useEffect(() => {
        const getData = async () => {
            const initialData = await fetchData(currentPage, limit);
            if (initialData.length > 0) {
                setData(initialData);
            } else {
                setHasMore(false);  // No more data to load
            }
            setLoading(false);
        };
        getData();
    }, [currentPage, limit]);

    // Load more data when needed
    const handleLoadingMore = async () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const newPage = currentPage + 1;
            const newLimit = limit; // Maintain the limit or adjust as needed

            const newData = await fetchData(newPage, newLimit);
            if (newData.length > 0) {
                setData(prevData => [...prevData, ...newData]);
                setCurrentPage(newPage); // Update current page
            } else {
                setHasMore(false); // No more data to load
            }
            setLoadingMore(false);
        }
    };

    // Scroll event listener to load more data when reaching the bottom
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                handleLoadingMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore]);

    const handleType = (type) => {
        const types = [
            'Mua hàng', 'Nạp tiền', 'Rút tiền', 'Bán được hàng', 
            'Xóa ảnh nền', 'Chiết khấu', 'Tạo nội dung', 
            'Mua kho mẫu thiết kế', 'Bán kho mẫu thiết kế', 
            'Nâng cấp bản pro', 'Tạo kho'
        ];
        return types[type] || 'Unknown';
    };

    function formatDateString(dateString) {
        const dateObject = new Date(dateString);
        const options = { year: "numeric", month: "numeric", day: "numeric" };
        return new Intl.DateTimeFormat("en-US", options).format(dateObject);
    }

    return (
        <div className='p-12 w-full font-family-[Roboto,_Helvetica,_Arial,_sans-serif] font-normal text-sm'>
            <div className='flex justify-evenly '></div>
            <div className="flex space-x-4 mt-7">
                <a href="/transaction/table-1" className="pb-2 border-b-2 font-weight text-lg border-transparent hover:border-red-600">
                    Giao dịch tiền mặt
                </a>
                <a href="" className="pb-2 border-b-2 font-weight text-lg border-red-600">
                    Giao dịch ecoin
                </a>
            </div>
            {loading ? (
                <div className="w-full">
                    <Flex align="center" gap="middle" className="flex justify-center items-center">
                        <Spin size="large" />
                    </Flex>
                </div>
            ) : (
                <>
                    {data.length > 0 ? (
                        <div className='my-14'>
                            <table className="w-full text-left shadow-lg">
                                <thead className="bg-gray-100">
                                    <tr className='border-b-2'>
                                        <th className="p-2">Số thứ tự</th>
                                        <th className="p-2">Kiểu giao dịch</th>
                                        <th className="p-2">Tên giao dịch</th>
                                        <th className="p-2">Mẫu thiết kế</th>
                                        <th className="p-2">Ngày giao dịch</th>
                                        <th className="p-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((row) => (
                                        <tr className="hover:bg-gray-50 border-b-2" key={row.id}>
                                            <td className="p-2">{row.id}</td>
                                            <td className="p-2">{handleType(row.type)}</td>
                                            <td className="p-2">{row.meta_payment}</td>
                                            <td className="p-2"><img src={row.image} alt="" className="h-10 w-10 object-cover" /></td>
                                            <td className="p-2">{formatDateString(row.created_at)}</td>
                                            <td className="p-2">
                                                <p className={`rounded text-center ${row.status === 1 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                    {row.status === 1 ? "Đang chờ" : "Hoàn thành"}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="center text-center w-full">
                            <Flex align="center" gap="middle" className="flex justify-center items-center">
                                <Spin size="large" />
                            </Flex>
                        </div>
                    )}
                    <ScrollToTopButton />
                    {loadingMore && (
                        <div className="center text-center w-full">
                            <Flex align="center" gap="middle" className="flex justify-center items-center">
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
