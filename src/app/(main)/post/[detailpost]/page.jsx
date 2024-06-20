'use client'
// import { useRouter } from 'next/navigation ';
import { useRouter } from 'next/navigation'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';

const NewsDetailPage = ({params}) => {
  const router = useRouter();
  // const { id } = router.query;
  console.log(params.detailpost);
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
// console.log(article , id)
// console.log(article , id)

  useEffect(() => {
    if (true) {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`https://apis.ezpics.vn/apis/getNewPostAPI`);
          setArticle(response?.data?.listData.find(data => data.id == params?.detailpost));
          setLoading(false);
        } catch (error) {
          console.error('Error fetching article:', error);
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return <p className="text-center mt-8">Bài viết không tồn tại.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{article.title}</h1>
      </header>
      <main>
        <img src={article.image} alt={article.title} className="w-full h-64 object-cover mb-4" />
        <div className="text-gray-700">
        <p>{article.description}</p>
        </div>
        <div className="text-gray-700 mt-4" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </main>
    </div>
  );
};

export default NewsDetailPage;
