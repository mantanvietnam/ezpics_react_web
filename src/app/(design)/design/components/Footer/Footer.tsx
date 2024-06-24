import Graphic from "./Graphic";
import useEditorType from "@/hooks/useEditorType";

export default function Footer() {
  const editorType = useEditorType();

  return <Graphic />;
}
