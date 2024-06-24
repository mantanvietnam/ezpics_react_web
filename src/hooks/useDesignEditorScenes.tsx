import React from "react";
import { DesignEditorContext } from "@/app/(design)/design/DesignEditorContext";

export default function () {
  const { scenes } = React.useContext(DesignEditorContext);
  return scenes;
}
