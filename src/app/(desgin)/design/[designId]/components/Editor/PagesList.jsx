import { DeleteOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { useSelector } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';
import ImageLayer from './ImageLayer';
import TextLayer from './TextLayer';

const PagesList = ({ totalPages, onPageClick, selectedPage, handleDeletePage }) => {
  // Tạo một mảng các số trang từ 0 đến totalPages - 1
  const pages = Array.from({ length: totalPages }, (_, index) => index);
  const stageData = useSelector((state) => state.stage.stageData);
  const {
    design,
    designLayers,
  } = stageData;
  const stageRef = useRef(null);

  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((page) => (
        // <div
        //   key={page}
        //   className={`relative w-[100px] h-[80px] bg-white rounded-sm flex justify-center items-center cursor-pointer ${page === selectedPage ? 'scale-110' : ''}`}
        //   onClick={() => onPageClick(page)}
        // >
        //   <div className="text-sm">Page {page}</div>
        //   <button className='absolute right-0 top-0 p-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-300'
        //     onClick={(e) => {
        //       e.stopPropagation()
        //       handleDeletePage(page)
        //     }}
        //   >
        //     <DeleteOutlined className='w-3 h-3' />
        //   </button>
        // </div>
        <div
          key={page}
          className={`relative w-[100px] h-[80px] bg-white rounded-sm flex justify-center items-center cursor-pointer ${page === selectedPage ? 'scale-110' : ''}`}
          onClick={() => onPageClick(page)}
        >
          <Stage
            ref={stageRef}
            key={page}
            width={100}
            height={80}
          >
            <Layer>
              <BackgroundLayer
                src={design?.thumn}
                width={100}
                height={80}
              />
              {
                designLayers
                  .filter(layer => layer?.content?.page === page)
                  .map(layer => {
                    if (layer.content?.type === "image") {
                      return (
                        <ImageLayer
                          key={layer.id}
                          designSize={{
                            width: 100,
                            height: 80,
                          }}
                          id={layer.id}
                          data={layer.content}
                          isSelected={false}
                          isSelectedFromToolbox={
                            false
                          }
                          onSelect={() => {
                          }}
                          isTransformerVisible={false}
                          onMaxPositionUpdate={false}
                          isDraggable={false} // Only allow dragging when unlocked
                          stageRef={stageRef}
                        // containerRef={containerRef}
                        />
                      );
                    } else if (layer.content?.type === "text") {
                      return (
                        <TextLayer
                          key={layer.id}
                          designSize={{
                            width: 100,
                            height: 80,
                          }}
                          id={layer.id}
                          data={layer.content}
                          isSelected={false}
                          isSelectedFromToolbox={
                            false
                          }
                          onSelect={() => {
                          }}
                          isTransformerVisible={false}
                          stageRef={stageRef}
                          isDraggable={false}
                        />
                      );
                    }
                  })
              }
            </Layer>
          </Stage>
          <button className='absolute right-0 top-0 p-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-300'
            onClick={(e) => {
              e.stopPropagation()
              handleDeletePage(page)
            }}
          >
            <DeleteOutlined className='w-3 h-3' />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PagesList;