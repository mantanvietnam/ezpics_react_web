'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import styles from './styles.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

// const Swiper = dynamic(() => import('swiper/react').then((mod) => mod.Swiper), { ssr: false });
// const SwiperSlide = dynamic(() => import('swiper/react').then((mod) => mod.SwiperSlide), { ssr: false });
// import { Pagination, Navigation } from 'swiper';

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://apis.ezpics.vn/apis/getNewPostAPI');
        setNews(response?.data?.listData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news data:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Tin Tức</h1>
      </header>
      <main className="flex flex-col lg:flex-row">
        <div className="flex-1">
          {/* {news?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Bài viết nổi bật</h2>
              <Swiper
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mb-8"
              >
                {news.slice(0, 5).map((article, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative">
                      <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h2 className="text-2xl text-white font-bold">{article.title}</h2>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )} */}

          {/* News List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {news?.map((article, index) => (
              <div key={index} className="bg-white p-2 rounded shadow flex flex-col">
                <img src={article?.image} alt={article?.title} className="w-full h-32 object-cover mb-2" />
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{article?.title}</h3>
                    <p className={`${styles.description} text-gray-700`}>{article?.description}</p>
                  </div>
                  <Link href={`/post/${article?.id}`} className="text-blue-500 mt-2 self-start">
                    Đọc thêm
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-64 ml-0 lg:ml-8 mt-8 lg:mt-0">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul>
              <li><a href="#" className="text-blue-500">Business</a></li>
              <li><a href="#" className="text-blue-500">Technology</a></li>
              <li><a href="#" className="text-blue-500">Sports</a></li>
              <li><a href="#" className="text-blue-500">Entertainment</a></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default NewsPage;
