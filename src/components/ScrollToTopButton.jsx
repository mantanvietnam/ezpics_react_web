// components/ScrollToTopButton.jsx
"use client"
import { useEffect, useState } from 'react';
import { AiFillCaretUp } from "react-icons/ai";
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hiển thị hoặc ẩn nút khi cuộn
    const toggleVisibility = () => {
      // if (window.pageYOffset > 300) {
      //   setIsVisible(true);
      // } else {
      //   setIsVisible(false);
      // }
      if (document.documentElement.scrollTop > 300 || window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility); 
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
    <div className="fixed bottom-12 right-1" >
    {isVisible &&(
      <div
      onClick={scrollToTop}
      className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 "
      >
        <AiFillCaretUp/>
        </div>
      )}
        </div>
      </>
  );
};

export default ScrollToTopButton;
