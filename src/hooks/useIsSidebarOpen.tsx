import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/[designId]/DesignEditorContext";

export default function () {
  const { isSidebarOpen } = useContext(DesignEditorContext);
  return isSidebarOpen;
}
