"use client"
import { logoutService } from '@/api/auth';
import axiosInstance from '@/api/axiosInstance';
import { DELETE_ALL_VALUES } from '@/redux/slices/infoUser';
import { checkAvailableLogin } from '@/utils/auth';
import { checkTokenCookie } from '@/utils/cookie';
import { signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    // Check page protected
    const isAuthenticated = checkAvailableLogin()
    const router = useRouter()
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        if (!isAuthenticated) {
            redirect("/sign-in")
        }
    }, [isAuthenticated])
    const handleLogout = async () => {
        const response = await logoutService({
            token: checkTokenCookie(),
        });
        await signOut({})
        if (response && response?.code === 0) {
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            dispatch(DELETE_ALL_VALUES());
            router.push("/sign-in");
        }
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.post(`/getMyProductAPI`, {
                    type: "user_edit",
                    token: checkTokenCookie(),
                    limit: 30,
                });
                console.log(response);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        getData()
    }, [])
    return (
        <div>
            huhu đã đăng nhập
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}