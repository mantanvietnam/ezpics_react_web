"use client";

import CollectionProductSlider from "@/components/Slide/CollectionProductSlider";
import EndowProduct from "@/components/Slide/EndowProduct";
import EventProductSlider from "@/components/Slide/EventProductSlider";
import SerisProductSlider from "@/components/Slide/SerisProductSlider";
import React from "react";

export default function page() {
  return (
    <>
      <SerisProductSlider />
      <CollectionProductSlider />
      <EndowProduct />
      <EventProductSlider />
    </>
  );
}
