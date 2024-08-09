"use client"
import React, { useState, useRef, useEffect } from "react";
import LayerIcon from "../../Icon/Layer";
import Return from "../../Icon/Return";
import ZoomIn from "../../Icon/ZoomIn";
import ZoomOut from "../../Icon/ZoomOut";
import Minus from "../../Icon/Minus";
import Plus from "../../Icon/Plus";
import { Button, Col, InputNumber, Row, Slider, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPage, deletePage, setCurrentPage, setStageData, updateListLayers } from "@/redux/slices/editor/stageSlice";
import { PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import PagesList from '../Editor/PagesList'
import { getLayersByPage } from '@/utils/editor';
import { deletePageAPI } from '@/api/design';
import { toast } from 'react-toastify';
import { checkTokenCookie } from '@/utils';

const scales = [5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];

const Footer = ({ containerRef }) => {
  const [currentScaleIdx, setCurrentScaleIdx] = useState(6); // Default index for scale 1
  const [sliderValue, setSliderValue] = useState(scales[currentScaleIdx]);
  const [showExtraSpace, setShowExtraSpace] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const dispatch = useDispatch();
  const stageData = useSelector((state) => state.stage.stageData);
  const { totalPages, designLayers } = stageData

  const updateScale = (scale) => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.transform = `scale(${scale})`;
      container.style.transformOrigin = "center"; // Set transform origin to center
      dispatch(setStageData({ ...stageData, scale }));
    }
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    const newScaleIdx = scales.indexOf(value);
    if (newScaleIdx !== -1) {
      setCurrentScaleIdx(newScaleIdx);
      updateScale(value);
    }
  };

  const handleInputChange = (value) => {
    if (value >= 0.05 && value <= 5) {
      setSliderValue(value);
      const newScaleIdx = scales.indexOf(value);
      if (newScaleIdx !== -1) {
        setCurrentScaleIdx(newScaleIdx);
        updateScale(value);
      }
    }
  };

  const handleMinusClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.min(prevIdx + 1, scales.length - 1));
    const newScale = scales[Math.min(currentScaleIdx + 1, scales.length - 1)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handlePlusClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.max(prevIdx - 1, 0));
    const newScale = scales[Math.max(currentScaleIdx - 1, 0)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handleZoomInClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.max(prevIdx - 1, 0));
    const newScale = scales[Math.max(currentScaleIdx - 1, 0)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  const handleZoomOutClick = () => {
    setCurrentScaleIdx((prevIdx) => Math.min(prevIdx + 1, scales.length - 1));
    const newScale = scales[Math.min(currentScaleIdx + 1, scales.length - 1)];
    setSliderValue(newScale);
    updateScale(newScale);
  };

  useEffect(() => {
    if (containerRef.current) {
      updateScale(scales[currentScaleIdx]);
    }
  }, [currentScaleIdx]);

  const LockUnlock = () => {
    const dispatch = useDispatch();
    const stage = useSelector((state) => state.stage.stageData);
    const [locked, setLocked] = useState(true);

    const items = Array.from(stage.designLayers);
    useEffect(() => {
      if (Array.isArray(items)) {
        setLocked(items.every(layer => layer.content.lock === 1));
      }
    }, [items]);

    const onChangeLocked = () => {
      const newLockState = locked ? 0 : 1;

      const updatedLayers = items.map((layer) => ({
        ...layer,
        content: {
          ...layer.content,
          lock: newLockState,
          draggable: newLockState === 0,
        },
      }));

      setLocked(!locked);
      dispatch(updateListLayers(updatedLayers));
      console.log("updatedLayers :", updatedLayers);
    };

    return (
      <>
        {locked ? (
          <div className="bg-[#ccc] rounded-md">
            <Tooltip placement="bottom" title="Mở khóa Layers">
              <Button onClick={onChangeLocked} size="small" type="text">
                <Return size={20} className="cursor-pointer" />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <Tooltip placement="bottom" title="Khóa Layers">
            <Button onClick={onChangeLocked} size="small" type="text">
              <Return size={20} className="cursor-pointer" />
            </Button>
          </Tooltip>
        )}
      </>
    );
  };

  const handlePageClick = (pageIndex) => {
    setSelectedPage(pageIndex);
    const pageLayers = getLayersByPage(designLayers, pageIndex)
    dispatch(setCurrentPage({
      page: pageIndex,
      pageLayers
    }))

    dispatch(setCurrentPage({
      page: pageIndex,
      pageLayers
    }))
  };

  const handleAddPage = () => {
    dispatch(addPage())
    setSelectedPage(totalPages + 1)
    dispatch(setCurrentPage({
      page: totalPages + 1,
      pageLayers: []
    }))
  }

  const handleDeletePage = async (page) => {
    dispatch(deletePage(page))
    if (page === selectedPage) {
      setSelectedPage((prev) => Math.max(0, prev - 1));
    }
    try {
      const response = await deletePageAPI({
        idProduct: stageData.design?.id,
        token: checkTokenCookie(),
        page: page
      })
      if (response.code === 0) {
        toast.success('Xóa trang thành công')
      } else {
        toast.error('Vui lòng thử lại!')
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
  }, [designLayers]);

  return (
    <div>
      <div className={`flex items-center extra-space ${showExtraSpace ? 'h-[100px]' : 'h-[0px]'} transition-height duration-300 ease overflow-hidden pl-2 gap-3`} style={{ width: '100%', backgroundColor: '#f0f0f0' }}>
        <PagesList totalPages={totalPages} onPageClick={handlePageClick} selectedPage={selectedPage} handleDeletePage={handleDeletePage} />
        <Button type="primary" icon={<PlusOutlined />} size='small' onClick={handleAddPage} />
      </div>
      <div className="flex flex-row justify-between items-center h-[50px] border-l border-slate-300 px-8 bg-white">
        <div className={`flex flex-row items-center cursor-pointer ${showExtraSpace ? 'bg-slate-300 p-1 rounded-lg' : ''}`} onClick={() => setShowExtraSpace(!showExtraSpace)}>
          <LayerIcon size={20} />
          <p className="pl-2">Trang</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="mx-2 cursor-pointer" onClick={handleZoomOutClick}>
            <ZoomOut size={20} />
          </div>
          <div className="mx-2 cursor-pointer" onClick={handleZoomInClick}>
            <ZoomIn size={20} />
          </div>
          <div className="mx-2 cursor-pointer" onClick={handleMinusClick}>
            <Minus size={20} />
          </div>
          <Row>
            <Col span={12}>
              <Slider
                min={0.05}
                max={5}
                step={0.05}
                onChange={handleSliderChange}
                value={sliderValue}
                open
              />
            </Col>
            <div className="mx-2 py-2 cursor-pointer" onClick={handlePlusClick}>
              <Plus size={20} />
            </div>
            <Col span={4}>
              <InputNumber
                min={0.05}
                max={5}
                step={0.05}
                style={{ margin: '0 16px' }}
                value={sliderValue}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
        </div>
        <div className="flex flex-row items-center">
          <LockUnlock />
        </div>
      </div>
    </div>
  );
};

export default Footer;
