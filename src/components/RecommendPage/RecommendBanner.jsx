import React from 'react'

export default function RecommendBanner() {
  return (
    <div
      style={{
        background: 'rgb(231, 246, 246)'
      }}
      className='flex flex-col items-start justify-center gap-5 p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]'>
      <div className='text-[32px] font-bold'>Bắt đầu giàu cảm hứng với Ezpics</div>
      <div className=''>Với hàng nghìn mẫu thiết kế độc đáo, hãy thổi hồn cho ý tưởng và tác phẩm tuyệt vời nhất của bạn.</div>
    </div>
  )
}
