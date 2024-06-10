
import YourProductBanner from '@/components/YourProduct/YourProductBanner'
import YourProductAction from '@/components/YourProduct/YourProductAction'
import React from 'react'

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
