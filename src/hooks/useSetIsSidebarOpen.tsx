import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/DesignEditorContext";

export default function () {
  const { setIsSidebarOpen } = useContext(DesignEditorContext);
  return setIsSidebarOpen;
}
