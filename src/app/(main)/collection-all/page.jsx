import React from 'react'
import { Input as Search } from 'antd'

export default function Page() {
  return (
    <div className='flex-col w-[90%] mt-5'>
      {/* Banner */}
      <div
        style={{
          background: 'rgb(231, 246, 246)',
        }}
        className='flex items-center justify-around gap-8 p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]'>
        <div className='flex flex-col gap-5'>
          <div className='text-[32px] font-bold'>Biến mỗi khoảnh khắc thành nghệ thuật</div>
          <div>Ezpics Collection - Tạo nên bộ sưu tập ảnh độc đáo, làm nổi bật câu chuyện của bạn.</div>
        </div>
        <div className='w-[300px] h-[300px]'>
          <img src='/images/hobby.png' alt="hobby" />
        </div>
      </div>
      {/* searchButton */}
      <div>
        <Search placeholder="input search text" enterButton="Search" size="large" loading />
      </div>
    </div>
  )
}
