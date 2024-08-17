"use client";

import { getProductCategoryAPI, getLogoProductApi } from "@/api/product";
import DefaultSlide from "@/components/Slide/DefaultSlide";
import { useEffect, useState } from "react";

export default function Page() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductCategoryAPI();
        setCategories(response.listData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {categories.map((category) => (
        <DefaultSlide
          key={category.id}
          apiAction={async () => {
            const products = await getLogoProductApi({
              category_id: category.id.toString(), 
              limit: "12",
              page: "1",
            });
            return products;
          }}
          title={category.name} 
          pathString="/dashboard-search"
        />
      ))}
    </div>
  );
}
8