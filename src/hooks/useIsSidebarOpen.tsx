import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/DesignEditorContext";

export default function () {
  const { isSidebarOpen } = useContext(DesignEditorContext);
  return isSidebarOpen;
}
