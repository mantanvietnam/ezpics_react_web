import YourProductBanner from '@/components/YourProduct/YourProductBanner'
import YourProductAction from '@/components/YourProduct/YourProductAction'
import React from 'react'

export const metadata = {
  title: "Thiết kế của bạn | Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    title: "Thiết kế của bạn | Ezpics",
    description: "Ezpics - Dùng là thích",
    type: "website",
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

export default function layout(props) {
  return (
    <div className='flex-col w-[90%]'>
      <div className='w-full pt-5'>
        <YourProductBanner />
      </div>
      <div className="pb-4">
        <YourProductAction />
      </div>
      {props.children}
    </div>
  )
}
