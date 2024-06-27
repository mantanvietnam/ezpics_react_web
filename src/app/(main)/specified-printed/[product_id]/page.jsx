"use client";
import {
  detailProductSeriesAPI,
  getProductAllCategoryAPI,
} from "@/api/product";
import { getUserInfoApi } from "@/api/user";
import AuthorInfo from "@/components/AuthorInfo_Printed";
import ProductInfoPrinted from "@/components/ProductInfo_Printed";
import DefaultSlideNoApi from "@/components/Slide/DefaultSliderNoApi";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const [otherData, setOtherData] = useState([]);
  const [dataLayer, setdataLayer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await detailProductSeriesAPI({
          idProduct: `${params.product_id}`,
        });
        setData(response?.data?.product);
        setdataLayer(response?.data?.listLayer);
        if (response.data && response.data?.product?.user_id) {
          try {
            const userResponse = await getUserInfoApi({
              idUser: `${response?.data?.product?.user_id}`,
            });
            setUser(userResponse.data);
          } catch (userError) {
            console.log(userError);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchProduct();
    getDataOther();
  }, [params.product_id]);

  const getDataOther = async () => {
    try {
      const response = await getProductAllCategoryAPI({
        limit: 30,
        keyword: "",
      });
      if (response && response.listData) {
        setOtherData(response.listData[2].listData);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  return (
    <div className='className="flex-col w-[90%] mb-[100px]'>
      <div className="w-full flex flex-col items-center justify-center gap-8">
        <ProductInfoPrinted
          data={data}
          user={user}
          isLoading={isLoading}
          dataLayer={dataLayer}
        />
        {isLoading ? (
          <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
          />
        ) : (
          <AuthorInfo user={user} />
        )}
        <DefaultSlideNoApi
          products={otherData}
          title="Mẫu thiết kế tương tự"
          pathString="/"
        />
      </div>
    </div>
  );
}
