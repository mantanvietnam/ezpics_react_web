/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'
import ChartPage from '../chart'
import { getDataTransaction, getDataTransactionEcoin } from '@/api/transaction'
import { checkTokenCookie } from '@/utils/cookie'
import { Button, Flex, Spin } from 'antd'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { SearchOutlined } from '@ant-design/icons'

const Page = () => {
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setdata] = useState([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchValue = {
        limit: limit,
        page: currentPage,
        token: checkTokenCookie(),
    };
    var token = checkTokenCookie();
    //   console.log("first" , token);
    useEffect(() => {
        const getdata = async () => {
            const data = await getDataTransactionEcoin(searchValue)
            setdata(data?.listData)
            console.log('data: ', data.listData)
        }
        getdata();
    }, [searchValue])

    const handleLoadingmore = () => {
        setlimit((prevPage) => prevPage + 10);
        setLoadingMore(true);

    }

    useEffect(() => {
        if (loadingMore) {
            const fetchData = async () => {
                try {
                    const response = await getDataTransactionEcoin(searchValue);
                    if (response?.listData?.length === 0) {
                        setHasMore(false);
                    } else {
                        setdata((prevProducts) => [
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
    const handleType = (type) => {
        if (type === 0) {
            return 'Mua hàng'
        }
        else if (type === 1) {
            return 'Nạp tiền'
        } else if (type === 2) {
            return 'Rút tiền'
        } else if (type === 3) {
            return 'bán được hàng'
        } else if (type === 4) {
            return 'Xóa ảnh nền'
        } else if (type === 5) {
            return 'Chiết khấu'
        } else if (type === 6) {
            return 'Tạo nội dung'
        } else if (type === 7) {
            return 'Mua kho mẫu thiết kế'
        } else if (type === 8) {
            return 'Bán kho mẫu thiết kế'
        } else if (type === 9) {
            return 'Nâng cấp bản pro'
        } else if (type === 10) {
            return 'Tạo kho'
        }
    }
    function formatDateString(dateString) {
        const dateObject = new Date(dateString);

        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        const formattedString = formatter.format(dateObject);
        return formattedString;
    }

    return (
        <div className='p-12  w-full font-family-[Roboto,_Helvetica,_Arial,_sans-serif] font-normal text-sm'>
            <div className='flex justify-evenly '>
            </div>
            <div className="flex space-x-4 mt-7	">
                <a href="/transaction/table-1" className="pb-2 border-b-2 font-weight text-lg border-transparent hover:border-red-600">
                    Giao dịch tiền mặt
                </a>
                <a href="" className="pb-2 border-b-2 font-weight text-lg border-red-600">
                    Giao dịch ecoin
                </a>
            </div>
            {/* Loading spinner */}
            {loading ? (
                <div className=" w-full">
                    <Flex
                        align="center"
                        gap="middle"
                        className="flex justify-center items-center">
                        {/* Placeholder for loading spinner */}
                        {/* <Spin size="large" /> */}

                    </Flex>
                </div>
            ) : (
                <>
                    {/* Products */}
                    {data.length > 0 ? (
                        <div className='my-14 ' >
                            <table className="w-full text-left shadow-lg ">
                                <thead className="bg-gray-100">
                                    <tr className='border-b-2'>
                                        <th className="p-2 ">Số thứ tự</th>
                                        <th className="p-2 ">Kiểu giao dịch</th>
                                        <th className="p-2 ">Tên giao dịch</th>
                                        <th className="p-2 ">Mẫu thiết kế</th>
                                        <th className="p-2 ">Ngày giao dịch</th>
                                        <th className="p-2 ">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((row) => (
                                        <tr className="hover:bg-gray-50  border-b-2" key={row.id}>
                                            <td className="p-2 ">{row.id}   </td>
                                            <td className="p-2 ">{handleType(row.type)}</td>
                                            <td className="p-2 ">{row.meta_payment}</td>
                                            <td className="p-2 "><img src={row.image} alt="hihi" className="h-10 w-10 object-cover" /></td>
                                            <td className="p-2 "> {formatDateString(row.created_at)}</td>
                                            <td className="p-2">
                                            <p
                                            className={`rounded text-center ${
                                                row.status === 1
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                            >
                                            {row.status === 1 ? "Đang chờ" : "Hoàn thành"}
                                            </p>
                                            </td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                            {/* <button onClick={handleLoadingmore}>xem thêm</button> */}
                            <Button onClick={handleLoadingmore} type="primary" danger className='h-[40px] w-[100px]' icon={loading ? '' : ''}>{loadingMore ?
                                <Flex align="center" gap="middle">
                                    <Spin size="small" />
                                </Flex> : 'Xem thêm'}</Button>
                        </div>
                    ) : (
                        <div className="center text-center w-full">
                            <Flex
                                align="center"
                                gap="middle"
                                className="flex justify-center items-center">
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
                                className="flex justify-center items-center">
                                {/* Placeholder for loading more spinner */}
                                <Spin size="large" />
                            </Flex>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Page