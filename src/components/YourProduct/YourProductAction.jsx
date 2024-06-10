"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function YourProductAction() {
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.post(`/getMyProductAPI`, {
                    type: "user_edit",
                    token: checkTokenCookie(),
                    limit: 30,
                });
                console.log(response);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        getData()
  }, [])
  
  const actions = [
    {
      title: 'Được đề suất',
      path: 'recommend'
    }
  ]
  return (
    <div className='flex items-center gap-3'>
      {
        actions.map((action, index) => (
          <div key={index}
            onClick={() => setActiveIndex(index)}
            className='relative'
          >
            <Link href={action.path} className='p-3 flex items-center justify-center'>
              <div className='text-[14px] font-semibold opacity-65 hover:opacity-100 ease-in duration-300'>
                {action.title}
              </div>
            </Link>
            <div className={`${activeIndex === index ? 'border-b-2 border-red-500' : ''}`}></div>
          </div>
        ))
      }
    </div>
  )
}
