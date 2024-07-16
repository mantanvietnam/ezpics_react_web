'use client'
// import { useRouter } from 'next/navigation ';
import { useRouter } from 'next/navigation'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import styles from '../styles.module.css'
import Link from 'next/link';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TruncatedText from '@/components/TruncatedText';


const NewsDetailPage = ({params}) => {
  const router = useRouter();
  // const { id } = router.query;
  console.log(params.detailpost);
  
  const [article, setArticle] = useState(null);
  const [news, setnews] = useState(null);
  const [loading, setLoading] = useState(true);
// console.log(article , id)
// console.log(article , id)

  useEffect(() => {
    if (true) {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`https://apis.ezpics.vn/apis/getNewPostAPI`);
          setArticle(response?.data?.listData.find(data => data.id == params?.detailpost));
          setnews(response?.data?.listData.filter(data => data.id != params?.detailpost));
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
console.log(article)
  return (
    <div className="container mx-auto p-4 w-4/5">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{article?.title}</h1>
      </header>
      <main >
        <img src={article?.image} alt={article?.title} className="w-full h-64 object-cover mb-4" />
        <div className="text-gray-700">
        <p>{article?.description}</p>
        </div>
        <div className="text-gray-700 mt-4 img-center" dangerouslySetInnerHTML={{ __html: article?.content }}></div>
      </main>
      <div className="mb-8 mt-8">
        <h1 className="text-4xl font-bold">Các bài viết khác</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {news?.slice(0, 4).map((article, index) => (
              <div key={index} className="bg-white rounded-md shadow flex flex-col overflow-hidden">
                <img src={article?.image} alt={article?.title} className="w-full h-32 object-cover mb-2" />
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      <TruncatedText text={article?.title} maxLength={35}/>
                    </h3>
                    <p className={`${styles.description} text-gray-700`}>
                      <TruncatedText text={article?.description} maxLength={90}/>
                    </p>
                  </div>
                  <Link href={`/post/${article?.id}`} className="text-blue-500 mt-2 self-start">
                    Đọc thêm
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <ScrollToTopButton/>

    </div>
  );
};

export default NewsDetailPage;
