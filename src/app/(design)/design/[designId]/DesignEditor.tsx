import useEditorType from "@/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicEditor from "./GraphicEditor";
import PresentationEditor from "./page";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Preview from "./components/Preview";

type DesignType = "NONE" | "PRESENTATION" | "VIDEO" | "GRAPHIC";

interface DesignEditorProps {
  params: any; // Define the actual type of params if known
}

function DesignEditor({ params }: DesignEditorProps) {
  const editorType: DesignType = useEditorType();
  console.log(editorType);

  const { displayPreview, setDisplayPreview } = useDesignEditorContext();

  const renderEditor = (type: DesignType) => {
    const editors = {
      NONE: <SelectEditor />,
      PRESENTATION: <PresentationEditor params={params} />,
      VIDEO: <SelectEditor />,
      GRAPHIC: <GraphicEditor />,
    };
    return editors[type];
  };

  return (
    <>
      {displayPreview && (
        <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />
      )}

      {renderEditor(editorType)}
    </>
  );
}

export default DesignEditor;
