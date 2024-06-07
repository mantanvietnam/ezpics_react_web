"use client"
import { logoutService } from '@/api/auth';
import { DELETE_ALL_VALUES } from '@/redux/slices/infoUser';
import { checkAvailableLogin } from '@/utils/auth';
import { checkTokenCookie } from '@/utils/cookie';
import { redirect, useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    // Check page protected
    const isAuthenticated = checkAvailableLogin()
    const dispatch = useDispatch();
    const router = useRouter()
    useLayoutEffect(() => {
        if (!isAuthenticated) {
            redirect("/sign-in")
        }
    }, [isAuthenticated])
    const handleLogout = async () => {
        const response = await logoutService({
            token: checkTokenCookie(),
        });
        if (response && response.code === 0) {
            document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            dispatch(DELETE_ALL_VALUES());
            router.push("/sign-in");
        }
    };
    return (
        <div>
            huhu đã đăng nhập
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}