import useEditorType from "@/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicPrinted from "./GraphicPrinted";
import PresentationEditor from "./page";
import VideoEditor from "./VideoEditor";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Preview from "./Preview";

function DesignPrinted() {
  const editorType = useEditorType();

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
          GRAPHIC: <GraphicPrinted />,
        }[editorType]
      }
    </>
  );
}

export default DesignPrinted;
