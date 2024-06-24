"use client";
import { buyWarehousesAPI, getCollectionProductApi, getInfoWarehouseApi, getProductsWarehousesAPI } from '@/api/product';
import { getUserInfoApi } from '@/api/user';
import AuthorInfo from '@/components/AuthorInfo';
import CollectionProductSlider from '@/components/Slide/CollectionProductSlider';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Modal, Radio, Skeleton, Space, Spin, Table } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
import images from '../../../../../public/images/index2';

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const ProductInfo = (props) => {
  const { data, user, isLoading, defaultPrice, collection } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openBuy, setOpenBuy] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [type, setType] = useState('')
  const userLogin = JSON.parse(Cookies.get('user_login'))
  const token = Cookies.get('token')

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const showModal = () => {
    if (!userLogin || !token) {
      router.push('/sign-in')
    } else {
      setOpenBuy(true)
    }
  }
  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const response = await buyWarehousesAPI({
        idWarehouse: data?.id,
        token: token,
        type: type
      })
      if (response.code === 1) {
        toast.success('Bạn đã mua thiết kế thành công')
      } else {
        toast.error(response.mess)
      }
      setOpenBuy(false)
      setConfirmLoading(false)
    } catch (error) {
      console.log(error)
      setOpenBuy(false)
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpenBuy(false)
  }

  const handleChangeRadio = (e) => {
    setType(e.target.value)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Giảm',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'sale_price',
      key: 'sale_price',
    },
    {
      title: 'eCoin',
      dataIndex: 'ecoin',
      key: 'ecoin',
    },
  ];

  const dataTable = [
    {
      key: '1',
      name: data?.name,
      products: data?.number_product,
      price: data?.price === 0 ? 'Miễn phí' : VND.format(defaultPrice),
      discount: data?.price ? `Giảm ${Math.round(100 - (data?.price / defaultPrice) * 100)}%` : 'Miễn Phí',
      sale_price: data?.price ? VND.format(data?.price) : "Miễn Phí",
      ecoin: `${data?.ecoin}e`
    },
  ]

  return (
    <div className='flex md:flex-row flex-col justify-around w-full h-full mt-[100px] mb-5'>
      <div className='md:w-1/2 w-full h-full flex flex-col items-center justify-between gap-8'>
        <div className="pr-6 flex items-center">
          {isLoading ? (
            <Skeleton.Image className='flex items-center justify-center' active='true' />
          ) : (
            <div className='flex items-center justify-center bg-orange-100'>
              <Image
                className='w-fit h-[500px]'
                src={data?.thumbnail} alt="product"
                width={800}
                height={400}
              />
            </div>
          )}
        </div>
        <div className='flex items-center w-[100%] justify-around pb-6'>
          {isLoading ? (
            <Skeleton.Input active='true' />
          ) : (
            <div className='flex items-center gap-2 my-2'>
              <span className='text-sm'>Chia sẻ:</span>
              <a href='/'>
                <img className='social-icons' src="/images/fb_logo.png" alt="fb" />
              </a>
              <a href='/'>
                <img className='social-icons' src="/images/twitter.png" alt="twitter" />
              </a>
              <a href='/'>
                <img className='social-icons' src="/images/messenger.png" alt="messenger" />
              </a>
              <a href='/'>
                <img className='social-icons' src="/images/pinterest.png" alt="pinterest" />
              </a>
            </div>
          )}
          {isLoading ? (
            <Skeleton.Input active='true' />
          ) : (
            <div className='flex items-center justify-center gap-1 border-l-2 border-slate-300 pl-1'>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 25,
                  height: 25,
                  borderRadius: "50%",
                  fill: 'currentColor'
                }}
              >
                <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                  style={{
                    color: 'rgb(255, 66, 78)',
                  }}
                ></path>
              </svg>
              <span className='text-sm font-semibold'>Đã thích ({data?.favorites || 0})</span>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className='flex flex-col gap-5'>
          <Skeleton.Input active />
          <Skeleton.Input active />
          <Skeleton.Input active />
          <Skeleton.Input active />
          <div className='flex gap-5'>
            <Skeleton.Input active />
            <Skeleton.Input active />
          </div>
        </div>
      ) : (
        <div className='md:w-1/2 w-full flex flex-col justify-between'>
          <h2 className="md:text-3xl text-xl font-bold pb-2">{data?.name}</h2>
          <div className='flex items-center gap-5 bg-slate-100 p-5'>
            <div className='text-3xl text-red-500'>{data?.price ? VND.format(data?.price) : 'Miễn Phí'}</div>
            <div className='line-through text-slate-400 rounded-sm'>{VND.format(defaultPrice)}</div>
            <div className='bg-red-500 text-white p-2 font-semibold rounded-sm'>{data?.price ? `Giảm ${Math.round(100 - (data?.price / defaultPrice) * 100)}%` : 'Miễn Phí'}</div>
          </div>
          <div className='flex items-center gap-3 py-2'>
            <div className='text-sm product-details-e'>Khuyến mãi</div>
            <div className='bg-red-50 border border-red-500 text-red-500 p-2 font-semibold'>
              {data?.price ? `Giảm ${Math.round(100 - (data?.price / defaultPrice) * 100)}%` : 'Miễn Phí'}
            </div>
          </div>
          <div className='flex items-center gap-3 py-2'>
            <div className='product-details-e'>Tác giả</div>
            <div className='w-[35px] h-[35px]'>
              <img className='object-cover rounded-full' src={user?.avatar} alt="" />
            </div>
            <div><span>{data?.author}</span></div>
          </div>
          <div className='flex items-center gap-3 py-2'>
            <div className='product-details-e'>Số ngày sử dụng: </div>
            <div><span>{data?.date_use}</span></div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='product-details-e'>Lượt xem:</div>
            <div><span>{data?.views}</span></div>
          </div>
          <div className='flex items-center gap-3 py-2'>
            <>
              <button
                onClick={showLoading}
                className='flex items-center justify-center py-2 bg-red-50 border border-red-500 text-red-500 w-[200px] cursor-pointer animate-pulse'
              >
                <div>Chi tiết sản phẩm</div>
              </button>
              <Modal
                open={open}
                width={1200}
                footer={null}
                loading={loading}
                onCancel={() => setOpen(false)}
              >
                <h2 className="text-4xl text-center font-bold p-6">Chi tiết thiết kế trong bộ sưu tập</h2>
                <div className="w-[100%] mx-auto grid grid-cols-4 grid-flow-row gap-6">
                  {Array.isArray(collection) && collection.length > 0 ? (
                    collection.map((item) => (
                      <Link
                        href={`/collection-buying/${item.id}`}
                        className="relative card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58"
                        key={item.id}
                      >
                        <div className="relative bg-orange-100">
                          {item.image ? (
                            <Image src={item.image}
                              width={300}
                              height={200}
                              className="object-contain h-48 w-96"
                              alt={item.name}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Skeleton
                                avatar
                                paragraph={{
                                  rows: 4,
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="py-4 px-2">
                          <h2 className="text-lg font-medium h-20">{item.name}</h2>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-4 text-center text-gray-500">No collection items available.</div>
                  )}
                </div>
              </Modal>
            </>
            <button
              style={{
                backgroundColor: 'rgb(255, 66, 78)',
                color: 'white',
                cursor: 'pointer',
                width: '200px',
                paddingTop: '11.5px',
                paddingBottom: '11.5px',
              }}
              onClick={showModal}
            >
              Mua ngay
            </button>
          </div>
        </div>
      )}
      <Modal
        title="Mua thiết kế"
        open={openBuy}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        className='buy-product-modal'
      >
        <div>
          <Table columns={columns} dataSource={dataTable} pagination={false} className='mb-[20px]' />
          <Radio.Group name="radiogroup" defaultValue={type} onChange={handleChangeRadio} className='mb-[20px]'>
            <Radio value=''>Mua bằng tiền tài khoản</Radio>
            <Radio value='ecoin'>Mua bằng ecoin</Radio>
          </Radio.Group>
          <div className='flex gap-3 justify-end'>
            <div className='text-sm'>Số dư:</div>
            <div className='flex flex-col gap-1'>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.balance}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full pr-1"
                />{" "}
                <p>: {VND.format(userLogin?.account_balance)}</p>
              </div>
              <div className="flex items-center text-slate-500">
                <Image
                  src={images.eCoin}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full pr-1"
                />{" "}
                <p>: {userLogin?.ecoin} eCoin</p>
              </div>
            </div>
          </div>
          <div className='flex gap-2 justify-end mb-[20px] items-center'>
            <div className='text-lg font-semibold'>Tổng tiền:</div>
            <div className='text-lg font-semibold'>{type === 'ecoin' ? `${data?.ecoin} eCoin` : VND.format(data?.price)}</div>
          </div>
          <div className='flex justify-end'>
            <Button className='h-[35px]' onClick={handleCancel}>Hủy</Button>
            <button className='button-red text-sm font-semibold h-[35px] w-[200px]' onClick={handleOk}>
              {confirmLoading ?
                <div>
                  <Space>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />} />
                  </Space>
                </div> :
                'Thanh toán ngay'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default function Page({ params }) {
  const [data, setData] = useState([]);
  const [dataWarehouse, setDataWarehouse] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultPrice = 1000000;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getInfoWarehouseApi({ idWarehouse: `${params.productId}` });
        const productData = response.data;
        setData(productData)
        if (productData) {
          try {
            const userResponse = await getUserInfoApi({ idUser: productData.user_id });
            const dataWarehouseResponse = await getProductsWarehousesAPI({
              idWarehouse: productData.id,
              limit: 100,
              page: 1
            });
            setUser(userResponse.data);
            setDataWarehouse(dataWarehouseResponse.data);
          } catch (userError) {
            console.log('Error fetching user info:', userError);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching product data:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  return (
    <div className="flex flex-col w-[90%] mb-[100px]">
      <div className="w-full flex flex-col items-center justify-center gap-8">
        <ProductInfo data={data} user={user} isLoading={isLoading} defaultPrice={defaultPrice} collection={dataWarehouse} />
        {isLoading ? (
          <Skeleton
            avatar
            paragraph={{ rows: 4 }}
          />
        ) : (
          <AuthorInfo user={user} />
        )}
        <CollectionProductSlider title="Bộ sưu tập bạn có thể thích" />
      </div>
    </div>
  );
}

