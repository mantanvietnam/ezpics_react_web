"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function RecommendAction() {
  const [activeIndex, setActiveIndex] = useState(null);

  const actions = [
    {
      title: 'Được đề suất',
      path: 'recommend'
    },
    {
      title: 'Thumbnails Youtobe',
      path: 'youtube'
    },
    {
      title: 'Sự kiện',
      path: 'cooking'
    },
    {
      title: 'Logo',
      path: 'logo'
    },
    {
      title: 'Vinh danh',
      path: 'congrat'
    },
    {
      title: 'Banner',
      path: 'banner'
    },
    {
      title: 'Xem thêm',
      path: 'more'
    },
  ]
  return (
    <div className='flex items-center gap-3'>
      {
        actions.map((action, index) => (
          <div key={index}
            onClick={() => setActiveIndex(index)}
            className='relative'
          >
            <Link href={action.path} className='p-3 flex items-center justify-center'>
              <div className='text-[14px] font-semibold opacity-65 hover:opacity-100 ease-in duration-300'>
                {action.title}
              </div>
            </Link>
            <div className={`${activeIndex === index ? 'border-b-2 border-red-500' : ''}`}></div>
          </div>
        ))
      }
    </div>
  )
}
