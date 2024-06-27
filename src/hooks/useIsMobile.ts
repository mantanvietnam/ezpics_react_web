import { useContext } from "react";
import { AppContext } from "../app/(design)/design/[designId]/AppContext";

function useIsMobile() {
  const { isMobile } = useContext(AppContext);
  return isMobile;
}

export default useIsMobile;
