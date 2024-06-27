import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/[designId]/DesignEditorContext";

export default function useEditorType() {
  const { editorType } = useContext(DesignEditorContext);
  return editorType;
}
