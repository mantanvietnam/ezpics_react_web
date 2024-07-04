"use client";
import React, { useEffect } from "react";
import { Block, Responsive } from "baseui/block";
import Scrollable from "../../../../../../../components/Scrollable";
import { Delete } from "baseui/icon";
import { throttle } from "lodash";
import { useActiveObject, useEditor } from "@layerhub-io/react";
import { ADD_COLOR } from "../../../../../../../redux/slices/color/colorSlice";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../../hooks/hook";
import { Button } from "baseui/button";
import useAppContext from "../../../../../../../hooks/useAppContext";

const PRESET_COLORS = [
  "#f44336",
  "#ff9800",
  "#ffee58",
  "#66bb6a",
  "#26a69a",
  "#03a9f4",
  "#3f51b5",
  "#673ab7",
  "#9c27b0",
  "#ec407a",
  "#8d6e63",
  "#d9d9d9",
];

export default function TextFill() {
  const { setActiveSubMenu } = useAppContext();

  const dispatch = useAppDispatch();
  const [color, setColor] = React.useState("");
  const activeObject = useActiveObject();
  const editor = useEditor();
  const colorList = useAppSelector((state) => state.color.colorList);

  const updateObjectFill = (color: string) => {
    setColor(color);
    addObjectFill(color);
  };

  const addObjectFill = throttle((color: string) => {
    if (activeObject) {
      editor.objects.update({ fill: color });
    }
    dispatch(ADD_COLOR(color));
  }, 1);

  useEffect(() => {
    const getColorCurrentActive = () => {
      if (activeObject) {
        setColor(activeObject.fill);
        console.log(activeObject.fill);
      }
    };
    getColorCurrentActive();
  }, [activeObject]);

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          paddingRight: "1.5rem",
          paddingLeft: "1.5rem",
        }}
      >
        <h4 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>Màu</h4>

        <Block
          $style={{ cursor: "pointer", display: "flex" }}
          onClick={() => setActiveSubMenu("Graphics")}
        >
          <Delete size={24} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"1rem 1.5rem"}>
          <Button
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid gray",
              width: "100%",
              height: 50,
              backgroundColor: color,
            }}
          >
            <h4>Chọn màu</h4>
            <input
              type="color"
              style={{
                width: 30,
                height: 30,
                appearance: "none",
                background: "none",
                border: 0,
                cursor: "pointer",
                padding: 0,
              }}
              value={color}
              onChange={(e) => updateObjectFill(e.target.value)}
            />
          </Button>
          <Block
            $style={{
              paddingTop: "0.75rem",
              fontWeight: "600",
              fontSize: "14px",
              fontFamily: "Arial",
            }}
          >
            Màu đã dùng
          </Block>
          <Block padding={"1rem 0rem"}>
            <Block
              $style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                gap: "0.25rem",
              }}
            >
              {colorList.length > 0 &&
                colorList.slice(-3).map((color, index) => (
                  <Block
                    $style={{
                      cursor: "pointer",
                      borderRadius: "50px",
                    }}
                    onClick={() => updateObjectFill(color)}
                    backgroundColor={color}
                    height={"38px"}
                    key={index}
                  ></Block>
                ))}
            </Block>
          </Block>
          <Block>
            <Block
              $style={{
                paddingTop: "0.75rem",
                paddingBlock: "0.75rem",
                fontWeight: "600",
                fontSize: "14px",
                fontFamily: "Arial",
              }}
            >
              Màu cơ bản
            </Block>

            <Block
              $style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                gap: "0.25rem",
              }}
            >
              {PRESET_COLORS.map((color, index) => (
                <Block
                  $style={{
                    cursor: "pointer",
                    borderRadius: "50px",
                  }}
                  onClick={() => updateObjectFill(color)}
                  backgroundColor={color}
                  height={"38px"}
                  key={index}
                ></Block>
              ))}
            </Block>
          </Block>
        </Block>
      </Scrollable>
    </Block>
  );
}
