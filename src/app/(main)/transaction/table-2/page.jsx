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
                <div className="widgets flex flex-col w-3/5 pl-3 space-y-4 bg-center">
                    {/* <p>a</p> */}
                    <ChartPage />
                </div>
                <div className="widgets flex flex-col w-2/5 pl-3 space-y-4">
                    {/* widgets1 */}
                    <div className="widget flex justify-between items-center p-6 bg-white shadow rounded-lg">
                        <div className="left">
                            <span className="title text-gray-500">Số lượng giao dịch</span>
                            <span className="counter block text-2xl font-bold">72</span>
                            <a href="#" className="link text-blue-500 hover:underline">Xem thêm</a>
                        </div>
                        <div className="right flex items-center">
                            <div className="percentage positive flex items-center text-green-500">
                                <svg className="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                                </svg>
                            </div>
                            <svg className="icon w-10 h-10 fill-current text-crimson bg-red-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PersonOutlinedIcon">
                                <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                            </svg>
                        </div>
                    </div>
                    {/* widgets2 */}
                    <div className="widget flex justify-between items-center p-5 bg-white shadow rounded-lg">
                        <div className="left">
                            <span className="title text-gray-500">Đã mua trong tuần</span>
                            <span className="counter block text-2xl font-bold">83</span>
                            <a href="#" className="link text-blue-500 hover:underline">Xem thêm</a>
                        </div>
                        <div className="right flex items-center">
                            <div className="percentage positive flex items-center text-green-500">
                                <svg className="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                                </svg>
                            </div>
                            <svg className="icon w-10 h-10 fill-current text-goldenrod bg-yellow-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ShoppingCartOutlinedIcon">
                                <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                    {/* widgets3 */}
                    <div className="widget flex justify-between items-center p-6 bg-white shadow rounded-lg">
                        <div className="left">
                            <span className="title text-gray-500">Đã bán trong tuần</span>
                            <span className="counter block text-2xl font-bold">2</span>
                            <a href="#" className="link text-blue-500 hover:underline">Xem thêm</a>
                        </div>
                        <div className="right flex items-center">
                            <div className="percentage positive flex items-center text-green-500">
                                <svg className="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                                </svg>
                            </div>
                            <svg className="icon w-10 h-10 fill-current text-green bg-green-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MonetizationOnOutlinedIcon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4 mt-7	">
                <a href="/transaction/table-1" className="pb-2 border-b-2 border-transparent hover:border-red-600">
                    Giao dịch tiền mặt
                </a>
                <a href="" className="pb-2 border-b-2 border-red-600">
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
                                            <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>
                                                {row.status === 1 ? "Đang chờ" : "Hoàn thành"}
                                            </p></td>
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