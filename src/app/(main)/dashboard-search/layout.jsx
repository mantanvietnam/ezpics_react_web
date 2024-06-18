"use client"
import { useCallback, useEffect, useState } from 'react'
import { Button, Dropdown, Modal, Space, Input, Radio, Menu, Skeleton, Pagination } from 'antd'
import { ControlOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons'
import { getProductCategoryAPI, searchProductAPI } from '@/api/product'
import ProductComponent from '@/components/ProductComponent'
import { SkeletonCustom } from '@/components/Slide/CustomSlide'
import _ from 'lodash'
import { DateTime } from 'luxon';

export default function Layout(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [searchValue, setSearchValue] = useState({
    limit: 20,
    page: 1,
    name: '',
    price: '',
    orderBy: '',
    orderType: '',
    category_id: '',
    color: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [orderType, setOrderType] = useState('')
  const [price, setPrice] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [hasMoreData, setHasMoreData] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState({
    label: 'Danh mục',
    key: ''
  })
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await getProductCategoryAPI()
        setCategories(response.listData)
        setLoading(false)

      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await searchProductAPI(searchValue)
        setProducts(response.listData)
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchValue((prev) => ({ ...prev, name: value }));
  };

  const handleOrderTypeChange = (e) => {
    const value = e.target.value;
    setOrderType(value);
    setSearchValue((prev) => ({ ...prev, orderType: value }));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    setSearchValue((prev) => ({ ...prev, price: value }));
  };

  const handleOrderByChange = (e) => {
    const value = e.target.value;
    setOrderBy(value)
    setSearchValue((prev) => ({ ...prev, orderBy: value }));
  }

  const showModal = () => {
    setIsModalOpen(true);
    setClosing(false); // Reset trạng thái khi mở modal
  }

  const handleOk = () => {
    setClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500); // Thời gian trễ phải trùng với thời gian của animation
  }

  const handleCancel = () => {
    setClosing(true)
    setSearchValue((prev) => ({
      ...prev,
      limit: 20,
      page: 1,
      name: '',
      price: '',
      orderBy: '',
      orderType: '',
      category_id: '',
      color: ''
    }))
    setOrderBy('')
    setPrice('');
    setOrderType('');
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500); // Thời gian trễ phải trùng với thời gian của animation
  }

  const handleMenuClick = (e) => {
    setSelectedCategory({
      label: e.domEvent.target.innerText,
      key: e.key
    })
    setSearchValue((prev) => ({ ...prev, category_id: e.key }))
  }

  const handleScroll = useCallback(_.debounce(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  }, 200), [loading, hasMoreData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchData = async () => {
      if (page > 1) {
        try {
          const response = await searchProductAPI({ ...searchValue, page });
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
  }, [page]);

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await searchProductAPI(searchValue)
      setHasMoreData(true)
      setPage(1)
      setProducts(response.listData)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const menuProps = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key=''>Tất cả</Menu.Item>
      {
        categories.map(category => (
          <Menu.Item key={category.id}>{category.name}</Menu.Item>

        ))
      }
    </Menu>
  )
  console.log('-------------', page);

  return (
    <div className='flex flex-col w-[90%] gap-5'>
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
        />
        <Button onClick={handleSearch} type="primary" danger className='h-[40px]' icon={<SearchOutlined />}>Search</Button>
      </div>
      <div className='flex items-center gap-3'>
        <Button onClick={showModal} className='h-[40px]' icon={<ControlOutlined />}>Nâng cao</Button>
        <Dropdown overlay={menuProps}>
          <Button className='h-[40px]'>
            <Space>
              {selectedCategory.label}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
      <Modal
        title="Bộ lọc"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 0, left: 0, position: 'fixed', margin: 0 }}
        width="250px"
        className={`custom-modal ${closing ? 'slide-out-left' : 'slide-in-left'}`}
      >
        <div className='flex flex-col gap-5 mb-10'>
          <div className='flex flex-col gap-2 border-t pt-5'>
            <div className='text-sm font-semibold'>Sắp xếp theo</div>
            <Radio.Group onChange={handleOrderTypeChange} value={orderType}>
              <Space direction="vertical">
                <Radio value=''>Không</Radio>
                <Radio value='desc'>Giảm dần</Radio>
                <Radio value='asc'>Tăng dần</Radio>
              </Space>
            </Radio.Group>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-semibold'>Khoảng giá</div>
            <Radio.Group onChange={handlePriceChange} value={price}>
              <Space direction="vertical">
                <Radio value=''>Không</Radio>
                <Radio value='0-0'>Miễn phí</Radio>
                <Radio value='1000-5000'>Dưới 10.000đ</Radio>
                <Radio value='10000-100000'>Từ 10.000đ đến 100.000đ</Radio>
                <Radio value='100000-10000000000'>Trên 100.000</Radio>
              </Space>
            </Radio.Group>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-semibold'>Lọc theo</div>
            <Radio.Group onChange={handleOrderByChange} value={orderBy}>
              <Space direction="vertical">
                <Radio value=''>Không</Radio>
                <Radio value='price'>Sắp xếp theo giá</Radio>
                <Radio value='create'>Sắp xếp theo thời gian tạo</Radio>
                <Radio value='view'>Sắp xếp theo lượt xem</Radio>
                <Radio value='favorite'>Sắp xếp theo lượt yêu thích</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </Modal>
      {
        loading ? (
          <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5 mb-10'>
            {Array.from({ length: 20 }).map((_, index) => (
              <SkeletonCustom key={index}>
                <Skeleton.Image active />
                <Skeleton.Input active size="small" className="w-full pt-4" />
              </SkeletonCustom>
            ))}
          </div>
        ) :
          (<div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5 mb-10'>
            {
              products.length !== 0 ?
                products.map(product => (
                  <div key={product.id} className='flex justify-center items-center'>
                    <ProductComponent product={product} />
                  </div>

                )) :
                <div className='flex'>
                  <div className='text- font-semibold'>Không tìm thấy</div>
                </div>
            }
          </div>)
      }
      {
        hasMoreData ? (<div></div>) : (<div className=' text-center mb-10 font-semibold'>Không còn dữ liệu</div>)
      }
    </div >
  )
}
