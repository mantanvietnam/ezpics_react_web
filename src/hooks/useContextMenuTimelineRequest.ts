import { useContext } from "react";
import { DesignEditorContext } from "../app/(main)/design/DesignEditorContext";

function useContextMenuTimelineRequest() {
  const { contextMenuTimelineRequest } = useContext(DesignEditorContext);
  return contextMenuTimelineRequest;
}

export default useContextMenuTimelineRequest;
