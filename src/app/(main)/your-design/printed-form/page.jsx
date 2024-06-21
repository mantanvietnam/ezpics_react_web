'use client'
import React from 'react';
import { getMyProductSeriesAPI } from '@/api/product';
import DefaultPage from '@/components/YourProduct/DefaultPage';
import { checkTokenCookie } from '@/utils/cookie';

export default function Page() {

  const getMyProductData = async () => {
    return await getMyProductSeriesAPI({
      token: checkTokenCookie(),
      type: "user_series",
      limit: 100
    });
  };

  return (
    <DefaultPage getData={getMyProductData} />
  );
}
