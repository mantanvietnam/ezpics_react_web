import React from 'react'

export default function YourProductBanner() {
  return (
    <div
      style={{
        background: 'rgb(231, 246, 246)'
      }}
      className='flex flex-col w-1/2 items-start justify-center gap-5 p-[50px] rounded-[20px] relative overflow-hidden w-full h-[300px]'>
      <div className="w-1/2">
        <div className='text-[32px] font-bold'>Hãy thổi hồn vào các mẫu thiết kế của bạn</div>
        <div className=''>Không chỉ là mẫu thiết kế, mà là một phần của cuộc sống hiện đại, thể hiện sự cá nhân hóa và gu thẩm mỹ của bạn.</div>
      </div>
    </div>
  )
}
