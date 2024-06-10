import React from 'react'
import ChartPage from '../chart'
import { images } from '../../../../../public/images'

const page = () => {
  return (
    <div className='p-12  w-full font-family-[Roboto,_Helvetica,_Arial,_sans-serif] font-normal text-sm'>
    <div className='flex'>
        <div class="widgets flex flex-col w-1/2 pl-3 space-y-4 bg-center">
            {/* <p>a</p> */}
            <ChartPage />
        </div>
        <div class="widgets flex flex-col w-1/2 pl-3 space-y-4">
            {/* widgets1 */}
            <div class="widget flex justify-between items-center p-4 bg-white shadow rounded-lg">
                <div class="left">
                    <span class="title text-gray-500">Số lượng giao dịch</span>
                    <span class="counter block text-2xl font-bold">72</span>
                    <a href="#" class="link text-blue-500 hover:underline">Xem thêm</a>
                </div>
                <div class="right flex items-center">
                    <div class="percentage positive flex items-center text-green-500">
                        <svg class="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                        </svg>
                    </div>
                    <svg class="icon w-10 h-10 fill-current text-crimson bg-red-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PersonOutlinedIcon">
                        <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                </div>
            </div>
            {/* widgets2 */}
            <div class="widget flex justify-between items-center p-4 bg-white shadow rounded-lg">
                <div class="left">
                    <span class="title text-gray-500">Đã mua trong tuần</span>
                    <span class="counter block text-2xl font-bold">83</span>
                    <a href="#" class="link text-blue-500 hover:underline">Xem thêm</a>
                </div>
                <div class="right flex items-center">
                    <div class="percentage positive flex items-center text-green-500">
                        <svg class="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                        </svg>
                    </div>
                    <svg class="icon w-10 h-10 fill-current text-goldenrod bg-yellow-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ShoppingCartOutlinedIcon">
                        <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                </div>
            </div>
            {/* widgets3 */}
            <div class="widget flex justify-between items-center p-4 bg-white shadow rounded-lg">
                <div class="left">
                    <span class="title text-gray-500">Đã bán trong tuần</span>
                    <span class="counter block text-2xl font-bold">2</span>
                    <a href="#" class="link text-blue-500 hover:underline">Xem thêm</a>
                </div>
                <div class="right flex items-center">
                    <div class="percentage positive flex items-center text-green-500">
                        <svg class="w-6 h-6 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowUpIcon">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                        </svg>
                    </div>
                    <svg class="icon w-10 h-10 fill-current text-green bg-green-100 rounded-full p-1 ml-4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MonetizationOnOutlinedIcon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div className="flex space-x-4 mt-7	">
        <a href="" className="pb-2 border-b-2 border-red-600">
            Giao dịch tiền mặt
        </a>
        <a href="/transaction/table-2" className="pb-2 border-b-2 border-transparent hover:border-red-600">
            Giao dịch ecoin
        </a>
    </div>
    <div className='my-14 ' >
        <table className="w-full text-left shadow-lg ">
            <thead className="bg-gray-100">
                <tr className='border-b-2'>
                    <th className="p-2 ">Số thứ tự</th>
                    <th className="p-2 ">Kiểu giao dịch</th>
                    <th className="p-2 ">Tên giao dịch</th>
                    <th className="p-2 ">Mẫu thiết kế</th>
                    <th className="p-2 ">Ngày giao dịch</th>
                    <th className="p-2 ">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-gray-50  border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50  border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
            </tbody>
        </table>

    </div>
    <div>
        <table className="w-full text-left shadow-lg ">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 ">Số thứ tự</th>
                    <th className="p-2 ">Kiểu giao dịch</th>
                    <th className="p-2 ">Tên giao dịch</th>
                    <th className="p-2 ">Mẫu thiết kế</th>
                    <th className="p-2 ">Ngày giao dịch</th>
                    <th className="p-2 ">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
                <tr className="hover:bg-gray-50 border-b-2">
                    <td className="p-2 ">44076</td>
                    <td className="p-2 ">Nạp tiền</td>
                    <td className="p-2 ">Nạp tiền qua chuyển khoản ngân hàng</td>
                    <td className="p-2 "><img src={images.imgthunbnail} alt="hihi" className="h-10 w-10 object-cover" /></td>
                    <td className="p-2 ">6/3/2024</td>
                    <td className="p-2"> <p className=' bg-green-100 text-green-800 rounded text-center'>Đang chờ</p></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
  )
}

export default page