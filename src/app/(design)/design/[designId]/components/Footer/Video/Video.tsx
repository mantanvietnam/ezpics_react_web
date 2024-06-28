import Timeline from "./Timeline";
import Common from "./Common";
import { Block } from "baseui/block";

export default function Video() {
  return (
    <Block $style={{ background: "#ffffff" }}>
      <Timeline />
      <Common />
    </Block>
  );
}
