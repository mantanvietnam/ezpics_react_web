/* eslint-disable @next/next/no-img-element */
import React from 'react'

export default function AuthorInfo(props) {
  const { user } = props
  const isoString = user?.created_at
  const date = new Date(isoString)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const formattedDate = `Ngày ${day} Tháng ${month} Năm ${year}`

  return (
    <div className='flex flex-col gap-5 w-full'>
      <h2 className='text-lg font-semibold'>Chi tiết tác giả</h2>
      <div className='flex w-fit xl:flex-row flex-col justify-between items-start w-full gap-8'>
        <div className="flex justify-start">
          <div className='w-[65px] h-[65px]'>
            <img className='object-cover rounded-full mr-4' src={user?.avatar} alt="" />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-lg font-semibold'>{user?.name}</div>
            <div className='text-sm'>Email: {user?.email}</div>
            <div
              className='flex gap-1 items-center justify-center'
              style={{
                backgroundColor: 'rgb(255, 245, 241)',
                border: '1px solid rgb(255, 66, 78)',
                color: 'rgb(255, 66, 78)',
                width: '200px',
                height: '40px',
              }}
            >
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
                <path d="M19.3 16.9c.4-.7.7-1.5.7-2.4 0-2.5-2-4.5-4.5-4.5S11 12 11 14.5s2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l3.2 3.2 1.4-1.4-3.2-3.2zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM12 20v2C6.48 22 2 17.52 2 12S6.48 2 12 2c4.84 0 8.87 3.44 9.8 8h-2.07c-.64-2.46-2.4-4.47-4.73-5.41V5c0 1.1-.9 2-2 2h-2v2c0 .55-.45 1-1 1H8v2h2v3H9l-4.79-4.79C4.08 10.79 4 11.38 4 12c0 4.41 3.59 8 8 8z"
                  style={{
                    color: 'rgb(255, 66, 78)',
                  }}
                ></path>
              </svg>
              <div>Xem tác giả</div>
            </div>
          </div>
        </div>
        <div className="flex xl:flex-row flex-col w-full justify-around">
          <div className='flex flex-col gap-2'>
            <div className='text-sm'>Số lượng theo dõi: <span className='text-red-500'>{user?.quantityFollow}</span></div>
            <div className='text-sm'>Số lượng sản phẩm: <span className='text-red-500'>{user?.quantityProduct}</span></div>
          </div>
          <div className='flex flex-col gap-2 xl:py-0 py-3'>
            <div className='text-sm'>Số lượng đã bán: <span className='text-red-500'>{user?.quantitySell}</span></div>
            <div className='text-sm'>Thành tiền: <span className='text-red-500'>{user?.sellingMoney}</span></div>
          </div>
          <div className=''>
            <div className='text-sm'>Ngày tạo: <span className='text-red-500'>{formattedDate}</span></div>
          </div>
        </div>
      </div>
    </div >
  )
}
