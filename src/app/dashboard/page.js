"use client"
import { checkAvailableLogin } from '@/utils/auth';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

export default function Dashboard() {
    const router = useRouter()
    const isAuthenticated = checkAvailableLogin()

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            redirect("/sign-in")
        }
    }, [isAuthenticated])
    const handleLogout = () => {
        router.push('/sign-in');
    };
    return (
        <div>
            huhu đã đăng nhập
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}