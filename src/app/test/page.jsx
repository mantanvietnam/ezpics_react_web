"use client";
import {
  CHANGE_STATUS_AUTH,
  CHANGE_VALUE_TOKEN,
} from "../../../../redux/slices/auth";
import { checkAvailableLogin, getCookie, setCookie } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const dispatch = useDispatch();
  // Kiểm tra trạng thái đăng nhập sau khi load (lưu vào cookies)
  const isAuthenticated_Cookie = checkAvailableLogin();
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.accessToken) {
      dispatch(CHANGE_VALUE_TOKEN(session?.accessToken));
      dispatch(CHANGE_STATUS_AUTH(true));
      setCookie("token", session?.accessToken, 3);
    }
    // cần xem lại dependencies
  }, [dispatch, session?.accessToken]);
  console.log("isAuthenticated_Cookie", isAuthenticated_Cookie);
  console.log(dispatch);
  console.log("session", session);
  // console.log('session2',session?.accessToken)
  getCookie;
  console.log("cookie :", getCookie);
  var cokkie = document.cookie;
  console.log("cokkie", cokkie);
  return (
    <div>
      {isAuthenticated_Cookie ? "Wellcome Đã đăng nhập : " : "Chưa Đăng nhập"}
    </div>
  );
};

export default Index;
