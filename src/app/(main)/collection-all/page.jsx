"use client"
import { searchWarehousesAPI } from '@/api/product'
import Collection from '@/components/Collection'
import { SearchOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { Flex, Spin } from 'antd'

export default function Page() {
  const [collections, setCollections] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)
  const [page, setPage] = useState(1)
  const [searchValues, setSearchValues] = useState({
    limit: 20,
    name: '',
    page: 1,
  })

  useEffect(() => {
    setLoading(true)
    const fetchApi = async () => {
      try {
        const response = await searchWarehousesAPI(searchValues)
        setCollections(response.data)
        setLoading(false)

      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
    fetchApi()
  }, [])

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
    setSearchValues((prev) => ({ ...prev, name: e.target.value }));
  }
  const handleScroll = useCallback(_.debounce(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }

  }, 200), [loading, hasMoreData])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll])

  useEffect(() => {
    if (!hasMoreData) {
      setLoading(false);
      return
    } else {
      const fetchData = async () => {
        if (page > 1) {
          try {
            const response = await searchWarehousesAPI({ ...searchValues, page });
            if (response.data) {
              setCollections(prevCollections => [...prevCollections, ...response.data]);
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

  }, [page]);

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await searchWarehousesAPI(searchValues)
      setHasMoreData(true)
      setPage(1)
      setCollections(response.data)
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
        const response = await searchWarehousesAPI(searchValues)
        setHasMoreData(true)
        setPage(1)
        setCollections(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
  };
  return (
    <div className='flex-col w-[90%] mt-5 mb-5'>
      {/* Banner */}
      <div
        style={{
          background: "rgb(231, 246, 246)",
        }}
        className="flex items-center justify-around gap-8 p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]">
        <div className="flex flex-col gap-5">
          <div className="text-[32px] font-bold">
            Biến mỗi khoảnh khắc thành nghệ thuật
          </div>
          <div>
            Ezpics Collection - Tạo nên bộ sưu tập ảnh độc đáo, làm nổi bật câu
            chuyện của bạn.
          </div>
        </div>
        <div className="w-[300px] h-[300px]">
          <img src="/images/hobby.png" alt="hobby" />
        </div>
      </div>
      {/* searchButton */}
      <div className='w-full lg:w-[60%] mt-5'>
        <div className='w-full pt-5 flex items-center gap-2'>
          <input
            placeholder='Tim kiem san pham'
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
          <Button onClick={handleSearch} type="primary" danger className='h-[40px] w-[100px]' icon={loading ? '' : <SearchOutlined />}>
            {loading ?
              <Flex align="center" gap="middle">
                <Spin size="small" />
              </Flex> : 'Search'}
          </Button>
        </div>
      </div>
      {/* list product */}
      {
        collections ?
          (<div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5'>
            {
              collections?.map(collection => (
                <div key={collection.id} className='flex justify-center items-center'>
                  <Collection collection={collection} />
                </div>
              ))
            }
            {loading &&
              <Flex align="center" gap="middle" className='flex justify-center items-center'>
                <Spin size="large" />
              </Flex>}
          </div>) : (<div className='mt-5 font-semibold text-lg'>Không tìm thấy kết quả</div>)
      }
    </div>
  );
}
