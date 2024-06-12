import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/YourProduct/ProductCard';
import { deleteProductAPI, duplicateProductAPI } from '@/api/product';
import { toast } from 'react-toastify';

export default function DefaultPage({ getData }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        console.log(response)
        setProducts(response.listData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [getData, products]);

  const onDeleteProduct = async (productId) => {
    try {
      await deleteProductAPI({
        token: "LF4z0ZHp1VSi6wBN5gxAMRWyCdOKlf1718011010",
        id: productId
      });
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      toast.success("Xóa thành công !!!")
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const onDuplicateProduct = async (productId) => {
    try {
      const newProduct = await duplicateProductAPI({
        token: "LF4z0ZHp1VSi6wBN5gxAMRWyCdOKlf1718011010",
        id: productId
      });
      const updatedProducts = [newProduct, ...products]; 
      setProducts(updatedProducts);
      toast.success("Nhân bản thành công !!!")
    } catch (error) {
      console.error("Error duplicating product:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProductCard 
      products={products} 
      onDeleteProduct={onDeleteProduct} 
      onDuplicateProduct={onDuplicateProduct} 
    />   
  );
}