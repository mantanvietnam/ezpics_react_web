import React, { useEffect, useState } from "react";
import ProductCard from "@/components/YourProduct/ProductCard";
import { deleteProductAPI, duplicateProductAPI } from "@/api/product";
import { checkTokenCookie } from "@/utils/cookie";
import { toast } from "react-toastify";
import { Skeleton } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DefaultPage({ getData, searchValue }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData;
        // setProducts(response.listData || response.data);
        setProducts(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [getData]);
  // console.log(searchValue)
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.post('https://apis.ezpics.vn/apis/getMyProductAPI',{
  //           token: checkTokenCookie(),
  //           name: searchValue?.name
  //         });
  //         setProducts(response?.listData || response?.data?.listData);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching data:", error.message);
  //         setError(error.message);
  //         setLoading(false);
  //       }
  //     };
  //     fetchData();
  //   }, [searchValue]);

  const onEditProduct = async (productId) => {
    router.push(`/design/${productId}`);
  };

  const onDeleteProduct = async (productId) => {
    try {
      await deleteProductAPI({
        token: checkTokenCookie(),
        id: productId,
      });
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
      toast.success("Xóa thành công !!!", {
        autoClose: 500,
      });
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };
  const onDuplicateProduct = async (productId) => {
    try {
      const response = await duplicateProductAPI({
        token: checkTokenCookie(),
        id: productId,
      });
      const updatedProducts = [response.data, ...products];
      setProducts(updatedProducts);
      toast.success("Nhân bản thành công", {
          autoClose: 500, 
        })
    } catch (error) {
      console.error("Error duplicating product:", error.message);
    }
  };
  const onPrintedPhoto = async (productId) => {
    // router.push(`/specified-printed/${productId}`);
    console.log(productId);
  };

  const onDownloadProduct = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_image.png"; // Set the desired filename

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      toast.success("Tải xuống thành công !!!", {
        autoClose: 500,
      });
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  if (loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 10,
        }}
      />
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProductCard
      products={products}
      onEditProduct={onEditProduct}
      onDeleteProduct={onDeleteProduct}
      onDownloadProduct={onDownloadProduct}
      onDuplicateProduct={onDuplicateProduct}
      onPrintedPhoto={onPrintedPhoto}
    />
  );
}
