"use client";
import React from "react";
import { Provider as ScenifyProvider } from "@layerhub-io/react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightTheme } from "baseui";
import { store } from "./store";
import { Provider } from "react-redux";
import { AppProvider } from "@/app/(design)/design/[designId]/AppContext";
import { DesignEditorProvider } from "@/app/(design)/design/[designId]/DesignEditorContext";
import { I18nextProvider } from "react-i18next";
import { TimerProvider } from "@layerhub-io/use-timer";
import i18next from "i18next";
import "./translations";

const engine = new Styletron();

export default function ProviderApp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* {openModal && } */}
      <Provider store={store}>
        <DesignEditorProvider>
          <TimerProvider>
            <AppProvider>
              <ScenifyProvider>
                <StyletronProvider value={engine}>
                  <BaseProvider theme={LightTheme}>
                    <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
                  </BaseProvider>
                </StyletronProvider>
              </ScenifyProvider>
            </AppProvider>
          </TimerProvider>
        </DesignEditorProvider>
      </Provider>
    </>
  );
}
