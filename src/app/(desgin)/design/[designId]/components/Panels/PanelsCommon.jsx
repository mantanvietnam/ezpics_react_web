import React, { useState } from "react";
import { Button, Popover, Tooltip, Space } from "antd";
import BringToFontIcon from "../../Icon/BringToFont";
import SendToBackIcon from "../../Icon/SendToBack";
import LayerIcon from "../../Icon/Layer";
import AlignBottomIcon from "../../Icon/AlignBottom";
import AlignCenterIcon from "../../Icon/AlignCenter";
import AlignLeftIcon from "../../Icon/AlignLeft";
import AlignMiddleIcon from "../../Icon/AlignMiddle";
import AlignRightIcon from "../../Icon/AlignRight";
import AlignTopIcon from "../../Icon/AlignTop";
import LockedIcon from "../../Icon/Locked";
import UnlockedIcon from "../../Icon/Unlocked";
import DuplicateIcon from "../../Icon/Duplicate";
import DeleteIcon from "../../Icon/Delete";

const LayersPopoverContent = ({
  onBringForward,
  onSendToBack,
  onSendToFront,
  onSendToFinal,
}) => (
  <div
    style={{
      padding: "12px",
      backgroundColor: "#ffffff",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: "8px",
      justifyItems: "start",
    }}>
    <Button
      icon={<BringToFontIcon size={20} />}
      onClick={onBringForward}
      type="text"
      size="small">
      Chuyển Layer lên trên 1 lớp
    </Button>
    <Button
      icon={<SendToBackIcon size={20} />}
      onClick={onSendToBack}
      type="text"
      size="small">
      Chuyển Layer ra sau 1 lớp
    </Button>
    <Button
      icon={<BringToFontIcon size={20} />}
      i
      onClick={onSendToFront}
      type="text"
      size="small">
      Chuyển Layer lên trên đầu
    </Button>
    <Button
      icon={<SendToBackIcon size={20} />}
      onClick={onSendToFinal}
      type="text"
      size="small">
      Chuyển Layer xuống dưới cùng
    </Button>
  </div>
);

const LayersPopover = ({
  onBringForward,
  onSendToBack,
  onSendToFront,
  onSendToFinal,
}) => (
  <Popover
    placement="bottomRight"
    content={
      <LayersPopoverContent
        onBringForward={onBringForward}
        onSendToBack={onSendToBack}
        onSendToFront={onSendToFront}
        onSendToFinal={onSendToFinal}
      />
    }
    trigger="click"
    autoFocus
    returnFocus>
    <Tooltip title="Chỉnh thứ tự Layers" placement="bottom">
      <Button size="small" type="text" icon={<LayerIcon size={25} />} />
    </Tooltip>
  </Popover>
);

const CommonLayers = () => {
  const handleBringForward = () => {
    console.log("Layer brought forward");
  };

  const handleSendToBack = () => {
    console.log("Layer sent to back");
  };

  const handleSendToFront = () => {
    console.log("Layer sent to front");
  };

  const handleSendToFinal = () => {
    console.log("Layer sent to final");
  };

  return (
    <div>
      <LayersPopover
        onBringForward={handleBringForward}
        onSendToBack={handleSendToBack}
        onSendToFront={handleSendToFront}
        onSendToFinal={handleSendToFinal}
      />
    </div>
  );
};

const CommonAlign = () => {
  return (
    <Popover
      placement="bottomRight"
      content={
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffffff",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridGap: "8px",
          }}>
          <Tooltip title="Chỉnh vị trí sang trái" placement="bottom">
            <Button type="text" size="small">
              <AlignLeftIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí trung tâm" placement="bottom">
            <Button type="text" size="small">
              <AlignCenterIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí sang phải" placement="bottom">
            <Button type="text" size="small">
              <AlignRightIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí lên trên" placement="bottom">
            <Button type="text" size="small">
              <AlignTopIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí ở giữa" placement="bottom">
            <Button type="text" size="small">
              <AlignMiddleIcon size={20} />
            </Button>{" "}
          </Tooltip>
          <Tooltip title="Chỉnh vị trí xuống dưới" placement="bottom">
            <Button type="text" size="small">
              <AlignBottomIcon size={20} />
            </Button>
          </Tooltip>
        </div>
      }
      trigger="click">
      <Tooltip title="Chỉnh vị trí" placement="bottom">
        <Button type="text" size="small">
          <AlignCenterIcon size={25} />
        </Button>
      </Tooltip>
    </Popover>
  );
};

const LockUnlock = () => {
  const [locked, setLocked] = useState(false);

  const handleLock = () => {
    setLocked(true);
  };

  const handleUnlock = () => {
    setLocked(false);
  };

  return (
    <>
      {locked ? (
        <Tooltip placement="bottom" title="Mở khóa Layers">
          <Button onClick={handleUnlock} size="small" type="text">
            <UnlockedIcon size={25} />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title="Khóa Layers">
          <Button onClick={handleLock} size="small" type="text">
            <LockedIcon size={25} />
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default function PanelsCommon() {
  return (
    <div className="flex">
      <div className="px-1 w-[50px]">
        <CommonLayers />
      </div>
      <div className="px-1 w-[50px]">
        <CommonAlign />
      </div>
      <div className="px-1 w-[50px]">
        <LockUnlock />
      </div>

      <div className="px-1 w-[50px]">
        <Tooltip placement="bottom" title="Nhân bản layer đã chọn">
          <Button size="small" type="text">
            <DuplicateIcon size={25} />
          </Button>
        </Tooltip>
      </div>

      <div className="px-1 w-[50px]">
        <Tooltip placement="bottom" title="Xóa layer đã chọn">
          <Button size="small" type="text">
            <DeleteIcon size={25} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
