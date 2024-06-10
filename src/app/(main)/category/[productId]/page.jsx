"use client";
import { getInfoProductApi } from '@/api/product';
import { getUserInfoApi } from '@/api/user';
import ProductInfo from '@/components/ProductInfo';
import { useEffect, useState } from 'react'

export default function Page({ params }) {
  const [data, setData] = useState({})
  const [otherData, setOtherData] = useState({})
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
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
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct()
  }, [params.productId])

  console.log('data:', data);
  console.log('otherData:', otherData);
  console.log('user:', user);

  return (
    <div className='className="flex-col w-[90%]'>
      <div className='w-full'>
        <ProductInfo data={data} user={user} />
      </div>
    </div>
  )
}
