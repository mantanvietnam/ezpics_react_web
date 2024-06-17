"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function YourProductAction() {
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = [
    {
      title: 'Mẫu mua',
      path: 'purchase-form'
    },
    {
      title: 'Mẫu bán',
      path: 'sale-sample'
    },
    {
      title: 'Mẫu in hàng loạt',
      path: 'printed-form'
    },
  ];

  return (
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
  )
}
