"use client";
import useEditorType from "@/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicEditor from "./GraphicEditor";
import PresentationEditor from "./PresentationEditor";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Preview from "./components/Preview";
import { REPLACE_ID_USER } from "@/redux/slices/token/reducers";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

type DesignType = "NONE" | "PRESENTATION" | "VIDEO" | "GRAPHIC";

interface DesignEditorProps {
  params: {
    designId: string;
  }; // Define the actual type of params if known
}

function DesignEditor({ params }: DesignEditorProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(REPLACE_ID_USER(params.designId));
  }, [dispatch, params]);

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
