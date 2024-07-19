/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react"
import { checkTokenCookie } from "@/utils"
import axios from "axios"
import { useSelector } from 'react-redux'
import { addLayerImageUrlAPI } from '@/api/design'
import { useDispatch } from 'react-redux'
import { addLayerImage } from '@/redux/slices/editor/stageSlice'

const Photos = ({ stageRef }) => {
  const [photos, setPhotos] = useState([])
  const stageData = useSelector((state) => state.stage.stageData)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `https://apis.ezpics.vn/apis/listImage`,
          {
            token: checkTokenCookie(),
          }
        )
        setPhotos(response.data.data.reverse())
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu GET:", error)
      }
    }

    fetchData()
  }, [])
  //B1: Call api tạo layer image
  //B2: Cập nhât redux để nó load lại state
  const handleAddPhoto = (item) => {
    const addLayer = async () => {
      try {
        const res = await addLayerImageUrlAPI({
          idproduct: stageData.design.id,
          token: checkTokenCookie(),
          imageUrl: item.link,
          page: 0
        })
        dispatch(addLayerImage(res.data))
      } catch (error) {
        console.log(error)
      }
    }
    addLayer()
  }

  return (
    <>
      <div className="absolute top-0 left-[100px] h-full w-[300px] overflow-y-scroll">
        <div className="px-6">
          <div>Ảnh đã tải lên</div>
          <div className="grid gap-2 grid-cols-2">
            {photos?.map((item, index) => {
              return (
                <ImageItem key={index} preview={`${item.link}`} item={item} onClick={() => { handleAddPhoto(item) }} />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

function ImageItem({ preview, onClick, onContextMenu, item }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="relative bg-[#f8f8fb] cursor-pointer rounded-lg overflow-hidden hover:before:opacity-100">
      <div className="absolute inset-0 h-full w-full"></div>
      <img
        src={preview}
        alt=""
        className="w-full h-full object-contain pointer-events-none align-middle"
      />
    </div>
  )
}

export default Photos
