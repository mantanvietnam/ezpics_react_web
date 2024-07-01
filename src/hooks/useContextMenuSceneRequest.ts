import { useContext } from "react"
import { DesignEditorContext } from "../app/(design)/design/[designId]/DesignEditorContext";
function useContextMenuSceneRequest() {
    const {
        contextMenuSceneRequest
    } = useContext(DesignEditorContext)
    return contextMenuSceneRequest
}

export default useContextMenuSceneRequest