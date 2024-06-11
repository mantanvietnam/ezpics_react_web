'use client'
import React from 'react';
import { getMyProductApi } from '@/api/product';
import DefaultPage from '@/components/YourProduct/DefaultPage';
import { checkTokenCookie } from '@/utils/cookie';

export default function Page() {

  const getMyProductData = async () => {
    return await getMyProductApi({ 
      type: "user_edit",
      // token: "U2rZ4thBHT9ImJf5qidsxGjbDEewF31718088855",
      token: checkTokenCookie(),
      limit: 12,
      page: 1
    });
  };

  return (
    <DefaultPage getData={getMyProductData} />
  );
}
