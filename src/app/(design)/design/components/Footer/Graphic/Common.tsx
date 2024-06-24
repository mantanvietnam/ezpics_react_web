"use client";
import React, { useRef, useEffect } from "react";
import Icons from "@/components/Icons";
import { Button, KIND, SIZE } from "baseui/button";
import { useZoomRatio, useEditor } from "@layerhub-io/react";
import { Block } from "baseui/block";
import { Slider } from "baseui/slider";
import { Input } from "baseui/input";

interface Options {
  zoomRatio: number;
}

interface State {
  panel: string;
}
export default function common({ setHide, hide }) {
  const zoomMin = 10;
  const zoomMax = 240;
  const editor = useEditor();
  const [options, setOptions] = React.useState<Options>({
    zoomRatio: 20,
  });
  React.useEffect(() => {
    setHide(false);
  }, []);
  const zoomRatio: number = useZoomRatio();
  const handleChange = (type: string, value: any) => {
    if (value < 0) {
      editor.zoom.zoomToRatio(zoomMin / 100);
    } else if (value > zoomMax) {
      editor.zoom.zoomToRatio(zoomMax / 100);
    } else {
      editor.zoom.zoomToRatio(value / 100);
    }
  };

  React.useEffect(() => {
    setOptions({ ...options, zoomRatio: Math.round(zoomRatio * 100) });
  }, [zoomRatio]);
  const simulateCtrlZ = () => {
    const event = new KeyboardEvent("keydown", {
      ctrlKey: true,
      // key: 'z',
    });
    if (event.ctrlKey) {
      console.log("Ctrl + Z pressed");
    }

    document.dispatchEvent(event);
  };

  // Đặt sự kiện click cho nút
  const handleButtonClick = () => {
    simulateCtrlZ();
  };

  return (
    <Block
      $style={{
        height: "50px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => setHide(!hide)}
        >
          <Icons.Layers size={15} />
          <p style={{ paddingLeft: 5 }}>Trang</p>
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", (options.zoomRatio = 100))}
        >
          <Icons.Expand size={16} />
        </Button>
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", (options.zoomRatio = 20))}
        >
          <Icons.Compress size={16} />
        </Button>
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", options.zoomRatio - 20)}
        >
          <Icons.RemoveCircleOutline size={24} />
        </Button>
        <Slider
          overrides={{
            InnerThumb: () => null,
            ThumbValue: () => null,
            TickBar: () => null,
            Root: {
              style: { width: "140px" },
            },
            Thumb: {
              style: {
                height: "12px",
                width: "12px",
                paddingLeft: 0,
              },
            },
            Track: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
          value={[options.zoomRatio]}
          onChange={({ value }) => {
            handleChange("zoomRatio", value[0]);
          }}
          min={zoomMin}
          max={zoomMax}
        />
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", options.zoomRatio + 20)}
        >
          <Icons.AddCircleOutline size={24} />
        </Button>
        <Input
          type="number"
          value={options.zoomRatio}
          endEnhancer="%"
          overrides={{
            Root: {
              style: {
                width: "96px",
              },
            },
          }}
          size={SIZE.mini}
          max={zoomMax}
          min={zoomMin}
          onChange={(e: any) => handleChange("zoomRatio", e.target.value)}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Refresh size={16} />
        </Button>
        {/* <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          // handleUndo
          onClick={handleButtonClick}
        >
          <Icons.Undo size={22} />
        </Button>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Redo size={22} />
        </Button> */}
        {/* <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.TimePast size={16} />
        </Button> */}
      </div>
    </Block>
  );
}
