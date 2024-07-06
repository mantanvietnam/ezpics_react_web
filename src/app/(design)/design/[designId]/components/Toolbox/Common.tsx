import React from "react";
import { Button, SIZE, KIND } from "baseui/button";
import { Checkbox } from "baseui/checkbox";
import { Block } from "baseui/block";
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip";
import { useActiveObject, useEditor, useObjects } from "@layerhub-io/react";
import { StatefulPopover } from "baseui/popover";
import DeleteIcon from "@/components/Icons/Delete";
import UnlockedIcon from "@/components/Icons/Unlocked";
import LockedIcon from "@/components/Icons/Locked";
import DuplicateIcon from "@/components/Icons/Duplicate";
import LayersIcon from "@/components/Icons/Layers";
import AlignCenter from "@/components/Icons/AlignCenter";
import AlignLeft from "@/components/Icons/AlignLeft";
import AlignRight from "@/components/Icons/AlignRight";
import AlignTop from "@/components/Icons/AlignTop";
import AlignMiddle from "@/components/Icons/AlignMiddle";
import BringToFront from "@/components/Icons/BringToFront";
import SendToBack from "@/components/Icons/SendToBack";
import AlignBottom from "@/components/Icons/AlignBottom";
import Opacity from "./Shared/Opacity";
import Lighting from "../Panels/panelItems/setting.png";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import useAppContext from "@/hooks/useAppContext";
import { REPLACE_METADATA } from "@/redux/slices/variable/variableSlice";
import useDesignEditorContext from "@/hooks/useDesignEditorContext";
import axios from "axios";
import { ILayer } from "@layerhub-io/types";
import { toast } from "react-toastify";

export default function Common() {
  const [state, setState] = React.useState({
    isGroup: false,
    isMultiple: false,
  });
  const activeObject = useActiveObject() as any;
  const variables = useAppSelector((state) => state.variable.metadataVariables);
  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const editor = useEditor();
  function findIndexById(arr: any, targetId: any) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetId) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  }
  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    console.log(currentScene);
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {
      const graphicTemplate: any = {
        id: currentDesign.id,
        type: "GRAPHIC",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      };

      let resultIndex = findIndexById(graphicTemplate.scenes, currentScene.id);
      console.log(resultIndex);

      return resultIndex;
    } else {
      console.log("NO CURRENT DESIGN");
    }
  };
  const network = useAppSelector((state) => state.network.ipv4Address);
  const idProduct = useAppSelector((state) => state.token.id);
  const token = useAppSelector((state) => state.token.token);

  const handleCopy = () => {
    editor.objects.clone();
  };
  React.useEffect(() => {
    if (activeObject) {
      console.log(activeObject);
      setState({
        isGroup: activeObject.type === "group",
        isMultiple: activeObject.type === "activeSelection",
      });
    }
  }, [activeObject]);

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject) {
        // @ts-ignore
        setState({
          isGroup: activeObject.type === "group",
          isMultiple: activeObject.type === "activeSelection",
        });
      }
    };
    if (editor) {
      editor.on("history:changed", watcher);
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher);
      }
    };
  }, [editor, activeObject]);

  return (
    <Block $style={{ display: "flex", alignItems: "center" }}>
      {activeObject?.metadata?.variable && <VariableLayer />}
      {state.isGroup ? (
        <Button
          onClick={() => {
            editor.objects.ungroup();
            setState({ ...state, isGroup: false });
          }}
          size={SIZE.compact}
          kind={KIND.tertiary}>
          Hợp nhóm
        </Button>
      ) : state.isMultiple ? (
        <Button
          onClick={() => {
            editor.objects.group();
            // setState({ ...state, isGroup: true })
          }}
          size={SIZE.compact}
          kind={KIND.tertiary}>
          Nhóm
        </Button>
      ) : null}

      {(state.isGroup || !state.isMultiple) && <CommonLayers />}
      <CommonAlign />
      <Opacity />
      <LockUnlock />
      <StatefulTooltip
        placement={PLACEMENT.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Nhân bản Layers đã chọn">
        <Button
          onClick={() => handleCopy()}
          size={SIZE.mini}
          kind={KIND.tertiary}>
          <DuplicateIcon size={22} />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        placement={PLACEMENT.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Xóa Layers đã chọn">
        <Button
          onClick={() => editor.objects.remove()}
          size={SIZE.mini}
          kind={KIND.tertiary}>
          <DeleteIcon size={24} />
        </Button>
      </StatefulTooltip>
    </Block>
  );
}

function CommonLayers() {
  const editor = useEditor();
  const [checked, setChecked] = React.useState(true);
  const activeObject = useActiveObject();
  const [layerObjects, setLayerObjects] = React.useState<any[]>([]);
  const objects = useObjects() as ILayer[];

  React.useEffect(() => {
    if (activeObject) {
      //  @ts-ignore
      setChecked(!!activeObject.clipPath);
    }
  }, [activeObject]);
  const handleSendToBack = () => {
    if (activeObject) {
      console.log(activeObject);
      const metadata = activeObject as { metadata?: { sort?: number } };
      if (
        metadata.metadata &&
        metadata.metadata.sort &&
        metadata.metadata.sort <= 1
      ) {
        toast.error("Đã dưới nền ảnh, không thể chuyển xuống", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        editor.objects.sendToBack();
      }
    }
  };
  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      content={() => (
        <Block padding={"12px"} backgroundColor={"#ffffff"}>
          <Block
            display={"grid"}
            gridTemplateColumns={"1fr 1fr"}
            gridGap={"8px"}>
            <Button
              startEnhancer={<BringToFront size={24} />}
              onClick={() => editor.objects.bringToFront()}
              kind={KIND.tertiary}
              size={SIZE.mini}>
              Chuyển Layer đã chọn ra trước
            </Button>
            <Button
              startEnhancer={<SendToBack size={24} />}
              onClick={() => handleSendToBack()}
              kind={KIND.tertiary}
              size={SIZE.mini}>
              Chuyển Layer đã chọn ra sau
            </Button>
          </Block>

          {/* <Block
            $style={{
              display: "flex",
              fontSize: "12px",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 500,
              fontFamily: "system-ui,",
              padding: "0.5rem 0.5rem",
              cursor: "pointer",
              ":hover": {
                background: "rgb(244,245,246)",
              },
            }}
          >
            <Checkbox
              overrides={{
                Checkmark: {
                  style: {
                    height: "16px",
                    width: "16px",
                  },
                },
              }}
              checked={checked}
              onChange={() => {
                editor.objects.update({ clipToFrame: !checked })
                setChecked(!checked)
              }}
            />
            <Block>Clip to frame</Block>
          </Block> */}
        </Block>
      )}
      returnFocus
      autoFocus>
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
          content="Chỉnh thứ tự Layers">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <LayersIcon size={19} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  );
}

function CommonAlign() {
  const editor = useEditor();
  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      content={() => (
        <Block
          padding={"12px"}
          backgroundColor={"#ffffff"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr"}
          gridGap={"8px"}>
          <Button
            onClick={() => editor.objects.alignLeft()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignLeft size={24} />
          </Button>
          <Button
            onClick={() => editor.objects.alignCenter()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignCenter size={24} />
          </Button>
          <Button
            onClick={() => editor.objects.alignRight()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignRight size={24} />
          </Button>
          <Button
            onClick={() => editor.objects.alignTop()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignTop size={24} />
          </Button>
          <Button
            onClick={() => editor.objects.alignMiddle()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignMiddle size={24} />
          </Button>
          <Button
            onClick={() => editor.objects.alignBottom()}
            kind={KIND.tertiary}
            size={SIZE.mini}>
            <AlignBottom size={24} />
          </Button>
        </Block>
      )}
      returnFocus
      autoFocus>
      <Block>
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
          content="Chỉnh vị trí">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <AlignCenter size={24} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  );
}

function LockUnlock() {
  const [state, setState] = React.useState<{ locked: boolean }>({
    locked: false,
  });
  const editor = useEditor();
  const activeObject = useActiveObject();

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      setState({ locked: !!activeObject.locked });
    }
  }, [activeObject]);

  return (
    <>
      {state.locked ? (
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
          content="Khóa Layers">
          <Button
            onClick={() => {
              editor.objects.unlock();
              setState({ locked: false });
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}>
            <UnlockedIcon size={24} />
          </Button>
        </StatefulTooltip>
      ) : (
        <StatefulTooltip
          placement={PLACEMENT.bottom}
          showArrow={true}
          accessibilityType={"tooltip"}
          content="Khóa Layers">
          <Button
            onClick={() => {
              editor.objects.lock();
              setState({ locked: true });
            }}
            size={SIZE.mini}
            kind={KIND.tertiary}>
            <LockedIcon size={24} />
          </Button>
        </StatefulTooltip>
      )}
    </>
  );
}

function VariableLayer() {
  const { setActiveSubMenu } = useAppContext();
  const editor = useEditor();
  const activeObject = useActiveObject() as any;
  const dispatch = useAppDispatch();
  const objectMetadata = (object: any) => {
    //  console.log(object.metadata)
    //  console.log(object)
    editor.objects.select(object.id);

    setActiveSubMenu("Landing");
    dispatch(REPLACE_METADATA(object.metadata));
  };
  return (
    <>
      <StatefulTooltip
        placement={PLACEMENT.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Sửa biến">
        <Button
          onClick={() => objectMetadata(activeObject)}
          size={SIZE.mini}
          kind={KIND.tertiary}>
          <img
            src="../Panels/panelItems/setting.png"
            style={{ width: 20, height: 20 }}
          />
        </Button>
      </StatefulTooltip>
    </>
  );
}
