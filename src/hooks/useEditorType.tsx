import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/DesignEditorContext";

export default function () {
  const { editorType } = useContext(DesignEditorContext);
  return editorType;
}
