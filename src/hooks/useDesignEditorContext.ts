import { useContext } from "react";
import { DesignEditorContext } from "@/app/(design)/design/[designId]/DesignEditorContext";

function useDesignEditorContext() {
  const {
    editorType,
    setEditorType,
    displayPlayback,
    setDisplayPlayback,
    setDisplayPreview,
    displayPreview,
    currentScene,
    setCurrentScene,
    setScenes,
    scenes,
    maxTime,
    setMaxTime,
    contextMenuTimelineRequest,
    setContextMenuTimelineRequest,
    currentDesign,
    setCurrentDesign,
  } = useContext(DesignEditorContext);
  return {
    editorType,
    setEditorType,
    displayPlayback,
    setDisplayPlayback,
    setDisplayPreview,
    displayPreview,
    currentScene,
    setCurrentScene,
    setScenes,
    scenes,
    maxTime,
    setMaxTime,
    contextMenuTimelineRequest,
    setContextMenuTimelineRequest,
    currentDesign,
    setCurrentDesign,
  };
}

export default useDesignEditorContext;
