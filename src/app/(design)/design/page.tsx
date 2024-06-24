"use client";
import Canvas from "./components/Canvas";
import EditorContainer from "./components/EditorContainer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Panels from "./components/Panels";

function PresentationEditor() {
  console.log(123);
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
