/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import ScrollToTopButton from '@/components/ScrollToTopButton';


const NewsDetailPage = ({params}) => {
  const [data, setData] = useState(null);
  const [news, setnews] = useState(null);
  const [loading, setLoading] = useState(true);


  const slug = params?.detailpost?.split(".html");
  const temp = slug[0]?.split("-");
  const postID = temp[temp.length - 1];
  
  useEffect(() => {
    if (true) {
      const fetchArticle = async () => {
        try {
          const response = await axios.post(
            "https://apis.ezpics.vn/apis/getInfoPostAPI",
            {
              id: postID,
            }
          );
          setData(response.data.data);
          setnews(response.data.content);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [postID]);

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
          <ScrollToTopButton/>
    </div>
  );
};

export default NewsDetailPage;
