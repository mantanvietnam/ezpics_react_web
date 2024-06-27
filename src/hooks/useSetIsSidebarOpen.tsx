import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/[designId]/DesignEditorContext";

export default function () {
  const { setIsSidebarOpen } = useContext(DesignEditorContext);
  return setIsSidebarOpen;
}
