
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import YourProductBanner from '@/components/YourProduct/YourProductBanner'

export default function Layout(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = [
    {
      title: 'Kho mua',
      path: 'purchase-collection'
    },
    {
      title: 'Kho bán',
      path: 'sale-collection'
    },
  ];
  return (
    <div className='flex-col w-[90%]'>
      <div className='w-full pt-5'>
        <YourProductBanner />
      </div>
      <div className="pb-4">
        <div className='flex items-center gap-3'>
          {actions.map((action, index) => (
            <div key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative p-3 flex items-center justify-center cursor-pointer ${activeIndex === index ? 'opacity-100 border-b-2 border-red-500' : 'opacity-65 hover:opacity-100 hover:border-b-2 hover:border-red-500'}`}
            >
              <Link href={action.path}>
                <div className='text-[14px] font-semibold'>
                  {action.title}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {props.children}
    </div>
  )
}
