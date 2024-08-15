/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Flex, Spin } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './styles.module.css'
import Link from 'next/link';
import 'swiper/css';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TruncatedText from '@/components/TruncatedText';
import { convertSLugUrl } from '@/utils/url';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const fetchNews = async (page) => {
    try {
      const response = await axios.post('https://apis.ezpics.vn/apis/getNewPostAPI', {
        limit,
        page,
      });
      return response?.data?.listData || [];
    } catch (error) {
      console.error('Error fetching news data:', error);
      return [];
    }
  };
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      const initialNews = await fetchNews(1);
      setNews(initialNews);
      setLoading(false);
    };

    initialFetch();
  }, []);
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && !loadingMore && hasMore) {
      setLoadingMore(true);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
    useEffect(() => {
    if (loadingMore) {
      const fetchData = async () => {
        const newNews = await fetchNews(currentPage + 1);
        if (newNews.length === 0) {
          setHasMore(false);
        } else {
          setNews((prevNews) => [...prevNews, ...newNews]);
          setCurrentPage((prevPage) => prevPage + 1);
        }
        setLoadingMore(false);
      };
      fetchData();
    }
  }, [currentPage, loadingMore]);

  
  const settings = {
    dots: false,
    infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
    };
  return (
    <div className="container mx-auto p-3 w-11/12">
      <div className="w-full mx-auto">
        <Slider {...settings}>
          {news?.slice(0, 5).map((image, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden">
              <img
                src={image.image}
                alt={`Slide ${index}`}
                className="w-full h-40 lg:h-72 xl:h-80 sm:h-52 md:h-60   object-cover mb-4 cursor-pointer"
              />
              <Link
                href={`/post/${convertSLugUrl(image.title)}-${image.id}.html`}
              >
                <div className="absolute bottom-0 left-0 w-full bg-gray-800 opacity-75 py-2 px-4 text-white text-center rounded-b-2xl">
                  <p className="text-sm">{image.title}</p>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Tin Tức</h1>
      </header>
      <main className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {news?.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-md shadow flex flex-col overflow-hidden relative  pb-7"
              >
                <Link
                  href={`/post/${convertSLugUrl(article?.title)}-${
                    article?.id
                  }.html`}
                  className="text-blue-500 mt-2 self-start"
                >
                  <img
                    src={article?.image}
                    alt={article?.title}
                    className="w-full h-32 object-cover mb-2 transition-transform duration-300 transform hover:scale-110"
                  />
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-black p-1">
                        <TruncatedText text={article?.title} maxLength={35} />
                      </h3>
                      <p
                        className={`${styles.description} text-gray-700 text-xs p-1`}
                      >
                        <TruncatedText
                          text={article.description}
                          maxLength={90}
                        />
                      </p>
                    </div>
                    <p className="absolute bottom-1 left-1 pl-1">Đọc thêm</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {loadingMore && (
            <div className="center text-center w-full">
              <Flex
                align="center"
                gap="middle"
                className="flex justify-center items-center"
              >
                <Spin size="large" />
              </Flex>
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default NewsPage;
