'use client'
import React from 'react';
import { getMyProductApi } from '@/api/product';
import DefaultPage from '@/components/YourProduct/DefaultPage';

export default function Page() {

  const getMyProductData = async () => {
    return await getMyProductApi({ 
      type: "user_edit",
      token: "LF4z0ZHp1VSi6wBN5gxAMRWyCdOKlf1718011010",
      // token: checkTokenCookie(),
      limit: 12,
      page: 1
    });
  };

  return (
    <DefaultPage getData={getMyProductData} />
  );
}
