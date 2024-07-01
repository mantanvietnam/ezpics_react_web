import useEditorType from "@/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicPrinted from "./GraphicPrinted";
import PresentationEditor from "./PresentationEditor";
import VideoEditor from "./VideoEditor";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Preview from "./components/Preview/index";

type DesignType = "NONE" | "PRESENTATION" | "VIDEO" | "GRAPHIC";

interface DesignEditorProps {
  params: {
    designId: string;
  }; // Define the actual type of params if known
}

function DesignPrinted({ params }: DesignEditorProps) {
  const editorType: DesignType = useEditorType();

  const { displayPreview, setDisplayPreview } = useDesignEditorContext();

  const renderEditor = (type: DesignType) => {
    const editors = {
      NONE: <SelectEditor />,
      PRESENTATION: <PresentationEditor />,
      VIDEO: <SelectEditor />,
      GRAPHIC: <GraphicPrinted />,
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

export default DesignPrinted;
