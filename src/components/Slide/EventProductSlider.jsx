import React from 'react'
import DefaultSlide from './DefaultSlide';
import { getLogoProductApi } from '@/api/product';

export default function EventProductSlider() {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getLogoProductApi({ category_id: '9', limit: '12', page: '1' }); // Call the function with ()
        return products; // Return the fetched products
      }}
      title="Banner event"
    />
  )
}
