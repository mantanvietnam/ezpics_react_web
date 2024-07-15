import { Block } from "baseui/block";
import Common from "./Common";

export default function Multiple() {
  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
      }}>
      <Block>Đa Layers</Block>
      <Common />
    </Block>
  );
}
