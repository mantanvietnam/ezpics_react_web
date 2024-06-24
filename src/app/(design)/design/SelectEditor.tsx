import React, { useEffect } from "react";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { DesignType } from "@/interfaces/DesignEditor";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import Video from "@/components/Icons/Video";
import Images from "@/components/Icons/Images";
import Presentation from "@/components/Icons/Presentation";

export default function () {
  const [selectedEditor, setSelectedEditor] =
    React.useState<DesignType>("GRAPHIC");
  const { setEditorType } = useDesignEditorContext();
  useEffect(() => {
    setEditorType("GRAPHIC");
  }, []);
  return (
    // <Block
    //   $style={{
    //     height: "100vh",
    //     width: "100vw",
    //     background: "#ffffff",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}
    // >
    //   <Block>
    //     <Block
    //       $style={{
    //         display: "flex",
    //         gap: "2rem",
    //       }}
    //     >
    //       <Block
    //         onClick={() => setSelectedEditor("GRAPHIC")}
    //         $style={{
    //           height: "180px",
    //           width: "180px",
    //           background: selectedEditor === "GRAPHIC" ? "#000000" : "rgb(231, 236, 239)",
    //           color: selectedEditor === "GRAPHIC" ? "#ffffff" : "#333333",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //           cursor: "pointer",
    //           flexDirection: "column",
    //           gap: "0.5rem",
    //         }}
    //       >
    //         <Images size={34} />
    //         <Block>Ảnh</Block>
    //       </Block>
    //       <Block
    //         onClick={() => setSelectedEditor("PRESENTATION")}
    //         $style={{
    //           height: "180px",
    //           width: "180px",
    //           background: selectedEditor === "PRESENTATION" ? "#000000" : "rgb(231, 236, 239)",
    //           color: selectedEditor === "PRESENTATION" ? "#ffffff" : "#333333",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //           cursor: "pointer",
    //           flexDirection: "column",
    //           gap: "0.5rem",
    //         }}
    //       >
    //         <Presentation size={36} />
    //         <Block>Trình chiếu</Block>
    //       </Block>

    //     </Block>
    //     <Block $style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
    //       <Button $style={{ width: "180px" }} onClick={() => setEditorType(selectedEditor)}>
    //         Tiếp tục
    //       </Button>
    //     </Block>
    //   </Block>
    // </Block>
    <></>
  );
}
