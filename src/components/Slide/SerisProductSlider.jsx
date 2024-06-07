import React from 'react'
import DefaultSlide from './DefaultSlide';
import { getserisProductApi } from '@/api/product';

export default function SerisProductSlider() {
  return (
    <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getserisProductApi({ limit: '12', page: '1' });
        const data = { listData: [...products.data] }
        return data; // Return the fetched products
      }}
      title="Mẫu thiết kế in hàng loạt"
      pathString="/"
    />
  )
}
