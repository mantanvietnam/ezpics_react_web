"use client";
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar/Navbar";
import Toolbox from "./components/Toolbox/Toolbox";
import { useParams } from 'next/navigation'
import { getListLayerApi } from '../../../../api/design'
import { checkTokenCookie } from '@/utils';
import { Stage, Layer, Rect, Image } from 'react-konva';
import BackgroundLayer from './components/Editor/BackgroundLayer'


const Page = () => {
  const params = useParams()
  const { designId } = params

  const [design, setDesign] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListLayerApi({ idproduct: designId, token: checkTokenCookie() })
        if (response.code === 1) {
          setDesign(response.data)
        }
        console.log('🚀 ~ fetchData ~ response.data:', response.data)

      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [designId])

  return (
    <>
      <div style={{ height: "100vh" }} className='relative'>
        <Navbar />
        <Toolbox />
        <div className='edit-container editor-nav bg-red-200 ml-[396px] flex items-center justify-center absolute'>
          <Stage width={design?.width} height={design?.height} className='bg-white'>
            <Layer>
              <BackgroundLayer src={design?.image} />
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
};

export default Page;
