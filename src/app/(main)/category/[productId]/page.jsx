"use client";
import { getInfoProductApi } from '@/api/product'
import { getUserInfoApi } from '@/api/user'
import AuthorInfo from '@/components/AuthorInfo'
import ProductInfo from '@/components/ProductInfo'
import DefaultSlideNoApi from '@/components/Slide/DefaultSliderNoApi'
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react'

export default function Page({ params }) {
  const [data, setData] = useState({})
  const [otherData, setOtherData] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await getInfoProductApi({ id: `${params.productId}` })
        setData(response.data)
        setOtherData(response.otherData)
        if (response.data && response.data.user_id) {
          console.log('...');
          try {
            const userResponse = await getUserInfoApi({ idUser: `${response.data.user_id}` });
            setUser(userResponse.data);
          } catch (userError) {
            console.log(userError);
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [params.productId])

  return (

    <div className='className="flex-col w-[90%] mb-[100px]'>
      <div className='w-full flex flex-col items-center justify-center gap-8'>
        <ProductInfo data={data} user={user} isLoading={isLoading} />
        {
          isLoading ? <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
          /> : <AuthorInfo user={user} />
        }
        <DefaultSlideNoApi
          products={otherData}
          title='Mẫu thiết kế tương tự'
          pathString='/'
        />

      </div>
    </div>

  )
}
