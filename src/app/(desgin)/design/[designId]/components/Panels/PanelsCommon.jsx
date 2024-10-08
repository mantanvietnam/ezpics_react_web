import React, { useState, useEffect } from "react";
import { Button, Popover, Tooltip, Space } from "antd";
import MoveOneLayerIcon from "../../Icon/MoveOneLayer";
import MoveFrontLayerIcon from "../../Icon/MoveFrontLayer";
import BackOneLayerIcon from "../../Icon/BackOneLayer";
import BackFinalLayerIcon from "../../Icon/BackFinalLayer";
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
import { useDispatch, useSelector } from "react-redux";
import { removeLayer, updateLayer } from "@/redux/slices/editor/stageSlice";
import {
  bringLayerForward,
  moveLayerToFinal,
  moveLayerToFront,
  sendLayerBack,
} from "@/redux/slices/editor/stageSlice";
import { deleteLayerAPI } from "@/api/design";
import { checkTokenCookie } from "@/utils";
import { toast } from "react-toastify";

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
      icon={<MoveFrontLayerIcon size={20} />}
      i
      onClick={onSendToFront}
      type="text"
      size="small">
      Chuyển Layer lên trên đầu
    </Button>
    <Button
      icon={<MoveOneLayerIcon size={20} />}
      onClick={onBringForward}
      type="text"
      size="small">
      Chuyển Layer lên trên 1 lớp
    </Button>
    <Button
      icon={<BackOneLayerIcon size={20} />}
      onClick={onSendToBack}
      type="text"
      size="small">
      Chuyển Layer ra sau 1 lớp
    </Button>
    <Button
      icon={<BackFinalLayerIcon size={20} />}
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
  const { selectedLayer } = useSelector((state) => state.stage.stageData);
  const dispatch = useDispatch();

  const handleBringForward = () => {
    dispatch(bringLayerForward({ id: selectedLayer.id }));
  };

  const handleSendToBack = () => {
    dispatch(sendLayerBack({ id: selectedLayer.id }));
  };

  const handleSendToFront = () => {
    dispatch(moveLayerToFront({ id: selectedLayer.id }));
  };

  const handleSendToFinal = () => {
    dispatch(moveLayerToFinal({ id: selectedLayer.id }));
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

const CommonAlign = ({ maxPositions }) => {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const [selectedLayer, setSelectedLayer] = useState({});

  useEffect(() => {
    if (stageData && stageData.selectedLayer) {
      setSelectedLayer(stageData.selectedLayer);
    }
  }, [stageData, stageData.selectedLayer]);

  if (!maxPositions) return null; // Tránh lỗi nếu maxPositions chưa được khởi tạo

  const { maxLeft, maxTop, centerX, centerY } = maxPositions;

  const onAlignLeftIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_left: 0.1,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  const onAlignRightIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_left: maxLeft - 0.1,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  const onAlignCenterIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_left: centerX,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  const onAlignTopIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_top: 0.1,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  const onAlignMiddleIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_top: centerY,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  const onAlignBottomIcon = () => {
    if (selectedLayer) {
      // Cập nhật dữ liệu layer
      const updatedData = {
        postion_top: maxTop,
      };

      // Dispatch hành động cập nhật layer
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

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
            <Button type="text" size="small" onClick={() => onAlignLeftIcon()}>
              <AlignLeftIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip
            title="Chỉnh vị trí trung tâm"
            placement="bottom"
            onClick={() => onAlignCenterIcon()}>
            <Button type="text" size="small">
              <AlignCenterIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí sang phải" placement="bottom">
            <Button type="text" size="small" onClick={() => onAlignRightIcon()}>
              <AlignRightIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí lên trên" placement="bottom">
            <Button type="text" size="small" onClick={() => onAlignTopIcon()}>
              <AlignTopIcon size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh vị trí ở giữa" placement="bottom">
            <Button
              type="text"
              size="small"
              onClick={() => onAlignMiddleIcon()}>
              <AlignMiddleIcon size={20} />
            </Button>{" "}
          </Tooltip>
          <Tooltip title="Chỉnh vị trí xuống dưới" placement="bottom">
            <Button
              type="text"
              size="small"
              onClick={() => onAlignBottomIcon()}>
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
  const dispatch = useDispatch();
  const selectedLayer = useSelector(
    (state) => state.stage.stageData.selectedLayer
  );
  const [locked, setLocked] = useState("");

  useEffect(() => {
    setLocked(selectedLayer?.content?.lock === 0);
  }, [selectedLayer]);

  const onChangeLocked = () => {
    const newLockState = locked ? 1 : 0;
    if (selectedLayer) {
      const updatedData = {
        lock: newLockState,
        draggable: newLockState === 0,
      };

      setLocked(!locked);
      dispatch(updateLayer({ id: selectedLayer.id, data: updatedData }));
    }
  };

  return (
    <>
      {locked ? (
        <Tooltip placement="bottom" title="Mở khóa Layers">
          <Button onClick={onChangeLocked} size="small" type="text">
            <UnlockedIcon size={25} />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title="Khóa Layers">
          <Button onClick={onChangeLocked} size="small" type="text">
            <LockedIcon size={25} />
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default function PanelsCommon({ maxPositions, onDuplicateLayer }) {
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const [selectedLayer, setSelectedLayer] = useState({});

  useEffect(() => {
    if (stageData && stageData.selectedLayer) {
      setSelectedLayer(stageData.selectedLayer);
    }
  }, [stageData, stageData.selectedLayer]);

  const handleDeleteLayer = () => {
    const deleteLayerApi = async () => {
      try {
        const res = await deleteLayerAPI({
          idproduct: selectedLayer.products_id,
          idlayer: selectedLayer.id,
          token: checkTokenCookie(),
        });
        if (res.code === 1) {
          dispatch(removeLayer(selectedLayer.id));
          toast.success("Xóa layer thành công !", {
            autoClose: 500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    deleteLayerApi();
  };


  return (
    <div className="flex">
      <div className="px-1 w-[50px]">
        <CommonLayers />
      </div>
      <div className="px-1 w-[50px]">
        <CommonAlign maxPositions={maxPositions} />
      </div>
      <div className="px-1 w-[50px]">
        <LockUnlock />
      </div>

      <div className="px-1 w-[50px]">
        <Tooltip placement="bottom" title="Nhân bản layer đã chọn">
          <Button size="small" type="text" onClick={() => onDuplicateLayer()}>
            <DuplicateIcon size={25} />
          </Button>
        </Tooltip>
      </div>

      <div className="px-1 w-[50px]">
        <Tooltip placement="bottom" title="Xóa layer đã chọn">
          <Button
            size="small"
            type="text"
            onClick={() => handleDeleteLayer()}
          >
            <DeleteIcon size={25} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
