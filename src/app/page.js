import Image from "next/image";
import Link from "next/link";
import Slide from "@/components/Slide";
import HomeBanner from '@/components/HomeBanner';

export default function Home() {
  return (
    <div className='w-full pt-[20px] px-[50px]'>
      <HomeBanner />
    </div>
  );
}
