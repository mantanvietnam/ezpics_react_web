'use client'
import { checkAvailableLogin } from '@/utils';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useSelector } from 'react-redux';

const Index = () => {
    // Cập nhật trạng thái ngay dựa vào redux
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // Cập nhật trạng thái đăng nhập sau khi load (lưu vào cookies)
    const isAuthenticated_Cookie = checkAvailableLogin()
    const { data: session } = useSession();

    return (
        <div>
            {isAuthenticated_Cookie || isAuthenticated ? 'Wellcome Đã đăng nhập : ' + session?.user?.name : 'Chưa Đăng nhập'}
        </div>
    )
}

export default Index
