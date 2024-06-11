import React from 'react'
import { Skeleton } from 'antd'
import { SkeletonCustom } from './Slide/CustomSlide';
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function ProductInfo(props) {
  const { data, user, isLoading } = props
  return (
    <div className='flex w-full h-[500px] mt-[100px]'>
      <div className='w-[50%] h-full flex flex-col items-center justify-center gap-8'>
        {
          isLoading ?
            <SkeletonCustom>
              <Skeleton.Image className='w-[80%] h-[50%] flex items-center justify-center' active='true' />
            </SkeletonCustom> :
            <div className='w-[80%] h-[50%] flex items-center justify-center bg-orange-100'>
              <img className='object-contain h-[100%]' src={data?.image} alt="product" />
            </div>
        }
        <div className='flex items-center w-[100%] justify-around'>
          {
            isLoading ?
              <Skeleton.Input active='true' /> :
              <div className='flex items-center gap-2'>
                <span className='text-sm'>Chia sẻ:</span>
                <a href='/'>
                  <img className='social-icons' src="/images/fb_logo.png" alt="fb" />
                </a>
                <a href='/'>
                  <img className='social-icons' src="/images/twitter.png" alt="fb" />
                </a>
                <a href='/'>
                  <img className='social-icons' src="/images/messenger.png" alt="fb" />
                </a>
                <a href='/'>
                  <img className='social-icons' src="/images/pinterest.png" alt="fb" />
                </a>
              </div>
          }
          {
            isLoading ? <Skeleton.Input active='true' /> :
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
                <span className='text-sm font-semibold'>Đã thích ({data?.favorites})</span>
              </div>
          }


        </div>
      </div>

      {
        isLoading ?
          <div className='flex flex-col gap-5'>
            <Skeleton.Input active />
            <Skeleton.Input active />
            <Skeleton.Input active />
            <Skeleton.Input active />
            <div className='flex gap-5'>
              <Skeleton.Input active />
              <Skeleton.Input active />
            </div>
          </div> :
          <div className='flex flex-col justify-between'>
            <div className='flex items-center gap-5 bg-slate-100 p-5'>
              <div className='text-3xl text-red-500'>{data?.sale_price ? VND.format(data?.sale_price) : 'Miễn Phí'}</div>
              <div className='line-through text-slate-400 rounded-sm'>{data?.price ? VND.format(data?.sale_price) : ''}</div>
              <div className='bg-red-500 text-white p-2 font-semibold rounded-sm'>{data?.sale_price ? `Giảm ${100 - (data?.sale_price / data?.price) * 100}%` : 'Miễn Phí'}</div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='text-sm product-details-e'>Khuyến mãi</div>
              <div style={{
                backgroundColor: 'rgb(255, 245, 241)',
                border: '1px solid rgb(255, 66, 78)',
                color: 'rgb(255, 66, 78)',
                padding: '2px',
                fontWeight: 'semibold',
              }}>
                {data?.sale_price ? `Lên đến ${100 - (data?.sale_price / data?.price) * 100}%` : 'Miễn Phí'}
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='product-details-e'>Tác giả</div>
              <div className='w-[35px] h-[35px]'>
                <img className='object-cover rounded-full' src={user?.avatar} alt="" />
              </div>
              <div><span>{data?.author}</span></div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='product-details-e'>Màu chủ đạo</div>
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: `${data?.color}`
              }}></div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='product-details-e'>Lượt xem</div>
              <div><span>{data?.views}</span></div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                style={{
                  backgroundColor: 'rgb(255, 245, 241)',
                  border: '1px solid rgb(255, 66, 78)',
                  color: 'rgb(255, 66, 78)',
                  width: '200px',
                  cursor: 'pointer',
                  animation: '2s linear 0s infinite normal none running thumbs-up'
                }}

                className='flex items-center justify-center py-2'>
                <svg style={{
                  color: 'rgb(255, 66, 78)',
                  width: '30px',
                  height: '30px',
                  fill: 'currentColor'
                }}>
                  <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                  </path>
                </svg>
                <div>Thêm vào yêu thích</div>
              </button>
              <button
                style={{
                  backgroundColor: 'rgb(255, 66, 78)',
                  color: 'white',
                  cursor: 'pointer',
                  width: '200px',
                  paddingTop: '11.5px',
                  paddingBottom: '11.5px',
                }}
              >
                Mua ngay
              </button>
            </div>
          </div>
      }
    </div >
  )
}
