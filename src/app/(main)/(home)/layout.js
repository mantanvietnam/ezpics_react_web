import HomeBanner from '@/components/HomeBanner';
import NewProductsSlider from '@/components/Slide/NewproductsSlider';
import SerisProductSlider from '@/components/Slide/SerisProductSlider';

export default function HomeRoot(props) {
  return (
    <div className='flex-col w-[85%]'>
      <div className='w-full p-[30px]'>
        <HomeBanner />
      </div>
        {props.children}
        {/* <SerisProductSlider /> */}
        <NewProductsSlider />
        <NewProductsSlider />
        <NewProductsSlider />
        <NewProductsSlider />
    </div>
  );
}
