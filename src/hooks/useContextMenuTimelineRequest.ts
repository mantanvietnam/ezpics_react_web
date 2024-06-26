import { useContext } from "react";
import { DesignEditorContext } from "../app/(design)/design/[designId]/DesignEditorContext";

function useContextMenuTimelineRequest() {
  const { contextMenuTimelineRequest } = useContext(DesignEditorContext);
  return contextMenuTimelineRequest;
}

export default useContextMenuTimelineRequest;
