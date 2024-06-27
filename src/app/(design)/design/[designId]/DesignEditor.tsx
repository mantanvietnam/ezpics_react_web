import useEditorType from "@/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicEditor from "./GraphicEditor";
import PresentationEditor from "./page";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Preview from "./components/Preview";

function DesignEditor() {
  const editorType = useEditorType();
  console.log(editorType);

  const { displayPreview, setDisplayPreview } = useDesignEditorContext();

  return (
    <>
      {displayPreview && (
        <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />
      )}

      {
        {
          NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <SelectEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </>
  );
}

export default DesignEditor;
