import React from "react";
import { DesignEditorContext } from "@/app/(design)/design/[designId]/DesignEditorContext";

export default function () {
  const { scenes } = React.useContext(DesignEditorContext);
  return scenes;
}
