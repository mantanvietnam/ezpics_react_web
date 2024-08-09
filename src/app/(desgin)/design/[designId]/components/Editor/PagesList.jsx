import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

const PagesList = ({ totalPages, onPageClick, selectedPage, handleDeletePage }) => {
  // Tạo một mảng các số trang từ 0 đến totalPages - 1
  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((page) => (
        <div
          key={page}
          className={`relative w-[100px] h-[80px] bg-white rounded-sm flex justify-center items-center cursor-pointer ${page === selectedPage ? 'scale-110' : ''}`}
          onClick={() => onPageClick(page)}
        >
          <div className="text-sm">Page {page}</div>
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
