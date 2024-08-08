import React from 'react';

const PagesList = ({ totalPages, onPageClick, selectedPage }) => {
  // Tạo một mảng các số trang từ 0 đến totalPages - 1
  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((page) => (
        <div
          key={page}
          className={`w-[100px] h-[80px] bg-white rounded-sm flex justify-center items-center cursor-pointer ${page === selectedPage ? 'scale-110' : ''}`}
          onClick={() => onPageClick(page)}
        >
          <div className="text-sm">Page {page}</div>
        </div>
      ))}
    </div>
  );
};

export default PagesList;
