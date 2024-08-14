'use client'
import React, { useEffect, useState } from 'react';
import { checkTokenCookie } from '@/utils/cookie';
import { getListWarehouseDesignerAPI, getProductsWarehousesAPI } from '@/api/product';
import { Skeleton, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { designAction } from '../../../../../public/images/index2';
import { toast } from 'react-toastify';
import AddWarehouse from '@/components/AddWarehouse';
import { convertSLugUrl } from '../../../../utils/url';

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await getListWarehouseDesignerAPI({ 
        token: checkTokenCookie(),
      });
      setProducts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      message.error("Failed to fetch products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = async (productId) => {
    setSelectedProduct(productId);
    setDetailsLoading(true);
    try {
      const response = await getProductsWarehousesAPI({ 
        idWarehouse: productId,
        limit: 100,
        page: 1
      });
      setProductDetails(response.data || []);
      setDetailsLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error.message);
      message.error("Failed to fetch product details.");
      setDetailsLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedProduct(null);
    setProductDetails([]);
  };

  const buttonsData = [
    {
      text: 'Sửa',
      icon: designAction.edit,
      action: (productId) => handleEdit(productId),
    },
    {
      text: 'Chia sẻ',
      icon: designAction.share,
      action: (productId, productName) => handleShare(productId, productName),
    },
    {
      text: 'Xem kho',
      icon: designAction.eye,
      action: (productId) => handleView(productId),
    },
  ];

  const handleEdit = (productId) => {
    // edit logic here
  };

  const handleShare = (productId) => {
    const url = `https://ezpics.vn/collection-buying/${convertSLugUrl(productName)}-${productId}.html`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Đã sao chép liên kết vào clipboard'))
      .catch((err) => toast.error('Failed to copy URL to clipboard:', err));
  };

  const handleView = (productId) => {
    handleProductClick(productId);
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="w-[100%] mx-auto">
      {selectedProduct ? (
        <div>
          {detailsLoading ? (
            <Skeleton />
          ) : (
            <div>
              <button className="border-2 border-gray-400 px-4 py-2 rounded-xl shadow-xl font-normal"
                onClick={handleBackClick}
              >&lt; Quay lại</button>
              {productDetails.length === 0 ? (
                <div className="text-center mt-8">
                  <p  className="text-center my-4">Bạn chưa có mẫu thiết kế nào.</p>
                  <Link href="/">
                    <button 
                      className="button-red" 
                    >
                      Về trang chủ
                    </button>
                  </Link>
                </div>
              ) : (
                <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5'>
                  {productDetails.map((product) => (
                    <Link href={`category/${convertSLugUrl(product.name)}-${product.id}.html`} className="slide-content" key={product.id}>
                      <div className="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58">
                        <div className="bg-orange-100 overflow-hidden group">
                          <Image
                            src={product.image || product.thumbnail}
                            width={300}
                            height={200}
                            className="object-contain h-48 w-96 transition-transform duration-300 ease-in-out group-hover:scale-110"
                            alt={product.name}
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-medium h-20">
                            {product.name}
                          </h2>
                          <p className="text-gray-500 mt-2 text-sm">
                            Đã bán {product.sold}
                          </p>
                          <div className="mt-2">
                            <span className="text-red-500 mr-2 font-bold text-sm">
                              {product.sale_price === 0
                                ? "Miễn phí"
                                : VND.format(product.sale_price)}
                            </span>
                            <span className="text-gray-500 line-through">
                              {VND.format(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {products.length === 0 ? (
            <div className="text-center mt-8">
              <p  className="text-center my-4">Bạn chưa có mẫu thiết kế nào.</p>
              <Link href="/">
                <button 
                  className="button-red" 
                >
                  Về trang chủ
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-end mb-4">
                <button 
                  className="button-red w-fit" 
                  onClick={() => setOpen(true)}
                >
                  + Tạo mới bộ sưu tập
                </button>
              </div>
                  
              <div className="grid grid-cols-4 grid-flow-row gap-4">
                {products.map((product) => (
                  <div
                    className="relative card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-58"
                    key={product.id} 
                  >
                    <div className="relative bg-orange-100">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          width={300}
                          height={200}
                          className="object-contain h-48 w-96"
                          alt={product.name}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Skeleton
                            avatar
                            paragraph={{
                              rows: 4,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      {/* Button overlay */}
                      <div className="flex flex-wrap justify-center">
                        {buttonsData.map((button, index) => (
                          <button
                            key={index} 
                            onClick={() => button.action(product.id, product.name)}
                            className="flex items-center justify-center mb-2 p-2 bg-white rounded-lg hover:bg-gray-200 transition duration-300 mr-2"
                            style={{ width: '100px' }}
                          >
                            <Image src={button.icon} alt={button.text} className="w-5 h-5" />
                            <span className="ml-2 text-sm">{button.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="py-4 px-2">
                      <h2 className="text-lg font-medium h-20">{product.name}</h2>
                    </div>
                  </div>       
                ))}
              </div>
            </div>
           
          )}
        </div>
      )}
      <AddWarehouse open={open} handleCancel={handleCancel} onSuccess={fetchProducts} />
    </div>
  );
}
