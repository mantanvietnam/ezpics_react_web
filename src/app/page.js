import Image from "next/image";
import Link from "next/link";
import HomeBanner from '@/components/HomeBanner';
import NewProductsSlider from '@/components/Slide/NewproductsSlider';
import DefaultSlide from '@/components/Slide/DefaultSlide';
import { getNewProducts } from '@/lib/actions/actions';

export default function Home() {

  return (
    <div className='w-full pt-[20px] px-[50px]'>
      <HomeBanner />
      <NewProductsSlider />
      <DefaultSlide
      apiAction={async () => {
        "use server";
        const products = await getNewProducts();
        return products;
      }}
      title="Mẫu thiết kế in hàng loạt"
      />
      <DefaultSlide
        apiAction={async () => {
          "use server";
          const products = await getNewProducts();
          return products;
        }}
        title="Bộ sưu tập thịnh hành"
      />
      <DefaultSlide
        apiAction={async () => {
          "use server";
          const products = await getNewProducts();
          return products;
        }}
        title="Có thể bạn muốn thử"
      />
      <DefaultSlide
        apiAction={async () => {
          "use server";
          const products = await getNewProducts();
          return products;
        }}
        title="Phổ biến"
      />
      </div>
  );
}
