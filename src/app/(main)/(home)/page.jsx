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
    if (session?.accessToken) {
      const getData = async () => {
        const response = await getInfoMemberAPI({
          token: session?.accessToken,
        });
        if (response && response.code === 0) {
          setCookie("user_login", response.data, 3);
        }
      };
      getData();
      dispatch(CHANGE_VALUE_TOKEN(session?.accessToken));
      dispatch(CHANGE_STATUS_AUTH(true));
      setCookie("token", session?.accessToken, 3);
    }
    // cần xem lại dependencies
  }, [dispatch, session?.accessToken]);

  return <></>;
}
