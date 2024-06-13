"use client"
import { getInfoMemberAPI } from "@/api/user";
import { CHANGE_STATUS_AUTH, CHANGE_VALUE_TOKEN } from "@/redux/slices/authSlice";
import { setCookie } from "@/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  // Kiểm tra trạng thái đăng nhập sau khi load (lưu vào cookies)
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.accessToken != undefined) {
      dispatch(CHANGE_VALUE_TOKEN(session?.accessToken));
      dispatch(CHANGE_STATUS_AUTH(true));
      setCookie("token", session?.accessToken, 3);
      setCookie("user_login", session?.user_login, 3);
    }
    // cần xem lại dependencies
  }, [dispatch, session]);

  return <></>;
}
