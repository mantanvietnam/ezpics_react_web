/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import styles from '../styles.module.css'
import Link from 'next/link';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TruncatedText from '@/components/TruncatedText';


const NewsDetailPage = ({params}) => {
  const [data, setData] = useState(null);
  const [news, setnews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (true) {
      const fetchArticle = async () => {
        try {
          const response = await axios.post('https://apis.ezpics.vn/apis/getInfoPostAPI', {
            id: params.detailpost,
          });
          console.log(response.data)
          setData(response.data.data);
          setnews(response.data.content);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [params?.detailpost]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center mt-8">Bài viết không tồn tại.</p>;
  }
  return (
    <div className="container mx-auto p-4 w-4/5">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{data?.title}</h1>
      </header>
      <main >
        <img src={data?.image} alt={data?.title} className="w-full h-64 object-cover mb-4" />
        <div className="text-gray-700">
        <p>{data?.description}</p>
        </div>
        <div className="text-gray-700 mt-4 img-center" dangerouslySetInnerHTML={{ __html: data?.content }}></div>
      </main>
      {/* <div className="mb-8 mt-8">
        <h1 className="text-4xl font-bold">Các bài viết khác</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {news?.slice(0, 4).map((data, index) => (
              <div key={index} className="bg-white rounded-md shadow flex flex-col overflow-hidden">
                <img src={data?.image} alt={data?.title} className="w-full h-32 object-cover mb-2" />
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      <TruncatedText text={data?.title} maxLength={35}/>
                    </h3>
                    <p className={`${styles.description} text-gray-700`}>
                      <TruncatedText text={data?.description} maxLength={90}/>
                    </p>
                  </div>
                  <Link href={`/post/${data?.id}`} className="text-blue-500 mt-2 self-start">
                    Đọc thêm
                  </Link>
                </div>
              </div>
            ))}
          </div> */}
          <ScrollToTopButton/>

    </div>
  );
};

export default NewsDetailPage;
