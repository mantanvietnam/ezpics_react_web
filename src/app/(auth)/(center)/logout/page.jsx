"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutService } from "@/api/auth";
import { checkTokenCookie } from "@/utils";
import { useDispatch } from "react-redux";
import { DELETE_ALL_VALUES } from "@/redux/slices/user/userSlice";

function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

const LogoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call the logout service
        await logoutService({
          token: checkTokenCookie(),
        });

        // Clear cookies
        clearAllCookies();
        document.cookie = `user_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        // Dispatch action to clear state if needed
        dispatch(DELETE_ALL_VALUES());

        // Redirect to homepage
        router.push("https://ezpics.vn");
      } catch (error) {
        console.error("Logout failed:", error);
        // Optionally handle errors, e.g., show an error message
      }
    };

    // Perform logout when the component mounts
    handleLogout();
  }, [dispatch, router]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
