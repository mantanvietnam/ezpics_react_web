"use client";
import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";

export default function ProviderApp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* {openModal && } */}
      <Provider store={store}>{children}</Provider>
    </>
  );
}
