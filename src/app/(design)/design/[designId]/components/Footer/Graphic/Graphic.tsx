"use client";
import React, { useState, useEffect } from "react";
import { styled } from "baseui";
import { Theme } from "baseui/theme";
import Common from "./Common";
import Scenes from "./Scenes";

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  background: $theme.colors.white,
}));
export default function Graphic() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    setHide(false);
  }, []);

  return (
    <Container>
      <Scenes hide={hide} />
      <Common setHide={setHide} hide={hide} />
    </Container>
  );
}
