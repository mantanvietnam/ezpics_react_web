import Canvas from "./components/Canvas";
import EditorContainer from "./components/EditorContainer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Panels from "./components/Panels";
import { REPLACE_ID_USER } from "@/redux/slices/token/reducers";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import React from "react";

function PresentationEditor() {
  return (
    <>
      <EditorContainer>
        <Navbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Panels />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Canvas />
            <Footer />
          </div>
        </div>
      </EditorContainer>
    </>
  );
}

export default PresentationEditor;
