import { useContext } from "react";
import { AppContext } from "../app/(main)/design/contexts/AppContext";

function useIsMobile() {
  const { isMobile } = useContext(AppContext);
  return isMobile;
}

export default useIsMobile;
