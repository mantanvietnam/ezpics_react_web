'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getMyProductApi } from '@/api/product';
import DefaultPage from '@/components/YourProduct/DefaultPage';
import { checkTokenCookie } from '@/utils/cookie';
import { Button, Flex, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash'

export default function Page() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const timeoutRef = useRef(null);
  const [hasMoreData, setHasMoreData] = useState(true)
  // const getMyProductData = async () => {
  //   return await getMyProductApi({
  //     type: "user_create",
  //     // token: "U2rZ4thBHT9ImJf5qidsxGjbDEewF31718088855",
  //     token: checkTokenCookie(),
  //     limit: 12,
  //     page: 1
  //   });
  // };
  const [searchValue, setSearchValue] = useState({
    limit: 20,
    page: 1,
    name: searchTerm,
    token: checkTokenCookie(),
    color: '',
    type: "user_create",
  })

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
  }, [products, searchValue])
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
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearchValue((prev) => ({ ...prev, name: value }));
    }, 2000); // 2000 milliseconds = 2 seconds
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(_.debounce(() => {
    // if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
    //   setLoading(true);
    //   setPage(prevPage => prevPage + 1);
    // }
  }, 200), [loading, hasMoreData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!hasMoreData) {
      setLoading(false);
      return
    } else {
      const fetchData = async () => {
        if (page > 1) {
          try {
            const response = await getMyProductApi({ ...searchValue, page });
            if (response.listData.length > 0) {
              setProducts(prevProducts => [...prevProducts, ...response.listData]);
              setHasMoreData(true)
            } else {
              setHasMoreData(false)
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      };
      fetchData();
    }
  }, [hasMoreData, page, searchValue]);

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
      <DefaultPage getData={products} />
      {loading &&
        <Flex align="center" gap="middle">
          <Spin size="large" />
        </Flex>
      }
    </>
  );
}
