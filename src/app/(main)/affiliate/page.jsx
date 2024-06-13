'use client'
import React, { useEffect, useState } from 'react';
import { getInfoMemberAPI } from '@/api/user';
import { checkTokenCookie } from '@/utils';
import { listUserGetAffsource } from '@/api/affiliate';
import { toast } from 'react-toastify';

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listUserGetAffsource({
          token: checkTokenCookie(),
        });
        const data = response?.data || [];
        setData(Array.isArray(data) ? data : []);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <table className="min-w-full bg-white border border-gray-300 mt-4">
      <thead>
        <tr className="w-full text-gray-600 text-sm leading-normal">
          <th className="py-3 px-4 text-left border-b">Số thứ tự</th>
          <th className="py-3 px-4 text-left border-b">Tên người được giới thiệu</th>
          <th className="py-3 px-4 text-left border-b">Email</th>
          <th className="py-3 px-4 text-left border-b">Số điện thoại</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" className="py-3 px-4 text-center">Không có dữ liệu</td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-3 px-4 text-left border-b">{index + 1}</td>
              <td className="py-3 px-4 text-left border-b">{item.name}</td>
              <td className="py-3 px-4 text-left border-b">{item.email}</td>
              <td className="py-3 px-4 text-left border-b">{item.phone}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default function Page() {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInfoMemberAPI({
          token: checkTokenCookie(),
        });
        setData(response.data);
        console.log("page:", response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.link_affiliate).then(() => {
      toast.success("Copy link thành công !!!")
    });
  };

  return (
    <div className="w-full h-fit px-8 pt-6">
      <div className="flex flex-row w-full h-fit items-center justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-2xl">Giới thiệu cho bạn bè, nhận phần thưởng</p>
          <div className="flex flex-row items-center my-5">
            <div className="max-w-[450px]">
              <p className="text-gray-700 text-sm tracking-wider leading-6">
                Khi bạn bè của bạn tham gia Ezpics và tạo thiết kế, cả hai bạn sẽ được chọn một trong những ảnh, biểu tượng hoặc hình minh họa cao cấp của chúng tôi (ngoài ra, hai bạn có thể cộng tác để cùng nhau tạo thiết kế!)
              </p>
            </div>
            <img src="/images/gift.png" className="w-24 h-24 ml-8" alt="Gift icon" />
          </div>
          <div className="bg-gray-200 mt-4 border-2 border-gray-300 rounded-md flex flex-row items-center pl-4 justify-between">
            <p className="truncate">{data?.link_affiliate}</p>
            <button className="px-4 py-2 button-red" onClick={handleCopy}>Sao chép</button>
          </div>
        </div>
        <div className="pr-10 pt-5 relative">
          <img src={data?.link_codeQR} className="w-48 h-48" alt="QR Code" />
          <p className="mt-2 text-center font-bold">{data?.name}</p>
        </div>
      </div>

      <div className="font-bold text-normal mt-10">
        <h2>Những người được bạn giới thiệu</h2>
        <DataTable />
      </div>
    </div>
  );
}
