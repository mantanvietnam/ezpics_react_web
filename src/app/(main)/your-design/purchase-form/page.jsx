'use client'
import React, { useEffect, useState } from 'react';
import { getMyProductApi } from '@/api/product';
import DefaultPage from '@/components/YourProduct/DefaultPage';
import { checkTokenCookie } from '@/utils/cookie';
import { Button, Flex, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function Page() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [searchValue, setSearchValue] = useState({
    token: checkTokenCookie(),
    limit: 20,
    page: 1,
    name: searchTerm,
  })

  // const getMyProductData = async () => {
  //   return await getMyProductApi({
  //     type: "user_edit",
  //     // token: "U2rZ4thBHT9ImJf5qidsxGjbDEewF31718088855",
  //     token: checkTokenCookie(),
  //     limit: 100,
  //     page: 1
  //   });
  // }; 
  // const getMyProductData = async () => {
  //   return await getMyProductApi(searchValue);
  // }; 
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await getMyProductApi(searchValue);
            setLoading(false)
            if (response?.listData?.length === 0) {
                setHasMore(false); // No more products to load
            } else {
                setProducts(response?.listData);
                console.log(products)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    fetchData()
},[searchValue])
  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await getMyProductApi(searchValue)
      setHasMoreData(true)
      setPage(1)
      setProducts(response.listData)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      setLoading(true)
      try {
        setLoading(true)
        // const response = await searchProductAPI(searchValue)
        setHasMoreData(true)
        setPage(1)
        // setProducts(response.listData)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
  };
  const handleSearchChange = (e) => {
    setTimeout(() => {
      const value = e.target.value;
      setSearchTerm(value);
      setSearchValue((prev) => ({ ...prev, name: value }));
    }, 1000)
  };
  
  return (
    <>
      <div className='w-1/3 pt-1 flex items-center gap-2 mb-5'>
        <input
          placeholder='Tìm kiếm ...'
          type="text"
          style={{
            backgroundColor: '#fff',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            borderRadius: '4px',
            boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
            outline: 'none'
          }}
          className='w-[60%] h-[40px] p-3'
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch} type="primary" danger className='h-[40px] w-[100px]' icon={loading ? '' : <SearchOutlined />}>{loading ?
          <Flex align="center" gap="middle">
            <Spin size="small" />
          </Flex> : 'Search'}</Button>
      </div>
      <DefaultPage getData={products} searchValue={searchValue} />
      {/* <DefaultPage getData={getMyProductData} searchValue={searchValue} /> */}
    </>
  );
}
