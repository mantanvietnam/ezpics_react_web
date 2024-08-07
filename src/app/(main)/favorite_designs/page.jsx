/* eslint-disable @next/next/no-img-element */
"use client";

import { getMyProductFavoriteAPI } from "@/api/product";
import { checkTokenCookie } from "@/utils/cookie";
import { truncateText } from "@/utils/format";
import { Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const YourDesign = () => {
  const itemsPerRow = 3;
  const router = useRouter();
  const [dataForYou, setDataForYou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (loading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadMore) {
          setIsLoadingMore(true);
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isLoadingMore, loadMore]
  );

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoadingMore(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await getMyProductFavoriteAPI({
          token: checkTokenCookie(),
          limit: limit * page,
        });
        if (response && response?.code === 1) {
          setDataForYou(response.listData);
          setLoadMore(response.listData.length < limit * page);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoadingMore(false);
        setLoading(false);
      }
    };
    getData();
  }, [page]);

  const skeletonArray = new Array(8).fill(0);
  return (
    <div className="container">
      {loading
        ? skeletonArray.map((_, index) => (
            <div className="item" key={index}>
              <div className="skeleton"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))
        : dataForYou.length > 0
        ? dataForYou.map((item, index) => {
            const isLastItem = index === dataForYou.length - 1;
            return (
              <div
                className="item"
                key={index}
                ref={isLastItem ? lastItemRef : null}>
                <div
                  className="image-container"
                  onClick={() => {
                    router.push(`/category/${item.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                  <img src={item.image} alt="" className="image" />
                </div>
                <div className="title-container">
                  <h5 className="title">{truncateText(item.name, 48)}</h5>
                </div>
              </div>
            );
          })
        : <div className="no-designs">
            <p className="no-designs-text">Bạn chưa có mẫu thiết kế nào.</p>
            <Link href="/">
              <button className="button-red">
                Về trang chủ
              </button>
            </Link>
          </div>
      }

      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          alignSelf: "center",
          paddingBottom: 10,
          flexDirection: "column",
          alignItems: "center",
        }}>
        {isLoadingMore && (
          <div className="loading-spinner">
            <Spin />
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-spinner {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .container {
          padding-top: 0;
          display: flex;
          flex-wrap: wrap;
          background: white;
          justify-content: flex-start;
        }
        .item {
          flex: 0 0 calc(25% - 16px);
          margin-bottom: 15px;
          box-sizing: border-box;
          padding: 0 8px;
          position: relative;
          margin-top: 2%;
          margin-right: 1%;
        }
        .skeleton {
          width: 100%;
          height: 180px;
          background: #f0f0f0;
          border-radius: 10px;
        }
        .skeleton-text {
          height: 70px;
          margin-top: 10px;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
        }
        .edit-button {
          color: black;
          margin: 5px;
          cursor: pointer;
          border-radius: 10px;
          background-color: white;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-icon {
          width: 20px;
          height: 20px;
        }
        .edit-text {
          margin: 0;
          padding-left: 5px;
          text-transform: none;
        }
        .image-container {
          position: relative;
          width: 100%;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
        }
        .image {
          width: 100%;
          height: 180px;
          object-fit: contain;
        }
        .title-container {
          height: 70px;
          max-width: 100%;
          color: rgb(37, 38, 56);
          font-family: Canva Sans, Noto Sans Variable, Noto Sans, -apple-system,
            BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 17px;
          margin: 0;
          margin-top: 10px;
        }
        .title {
          max-width: 100%;
          color: rgb(37, 38, 56);
          font-family: Canva Sans, Noto Sans Variable, Noto Sans, -apple-system,
            BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
          font-weight: 600;
          font-size: 17px;
          margin: 0;
        }
        .button-container {
          width: 100%;
          height: auto;
          display: flex;
          align-self: center;
          padding-bottom: 10px;
          flex-direction: column;
          align-items: center;
        }
        .load-more-button {
          margin-left: 20px;
          height: 40px;
          text-transform: none;
          color: white;
          background-color: rgb(255, 66, 78);
          align-items: center;
          width: 20%;
        }
        .no-designs {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          text-align: center;
          margin-top: 50px;
        }
        .no-designs-text {
          font-size: 18px;
          color: #555;
          margin-bottom: 20px;
        }
        .button-red {
          background-color: rgb(255, 66, 78);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .button-red:hover {
          background-color: rgb(200, 50, 60);
        }

        @media (max-width: 768px) {
          .item {
            flex: 0 0 calc(50% - 16px);
            max-width: 100%;
          }
          .load-more-button {
            width: 50%;
          }
        }

        @media (max-width: 480px) {
          .item {
            flex: 0 0 calc(100% - 16px);
            max-width: 100%;
          }
          .load-more-button {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default YourDesign;
