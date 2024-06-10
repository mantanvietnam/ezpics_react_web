
import RecommendAction from '@/components/RecommendPage/RecommendAction'
import NewProductsSlider from '@/components/Slide/NewproductsSlider'
import YourProductAction from '@/components/YourProduct/YourProductAction'
import YourProductBanner from '@/components/YourProduct/YourProductBanner'
import React from 'react'

export default function layout(props) {
  return (
    <div className='flex-col w-[90%]'>
      <div className='w-full pt-5'>
        <YourProductBanner />
      </div>
      <div>
        <YourProductAction />
      </div>
      {props.children}
      {/* <NewProductsSlider /> */}
    </div>
  )
}
