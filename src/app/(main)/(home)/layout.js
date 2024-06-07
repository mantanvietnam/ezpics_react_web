import HomeBanner from '@/components/HomeBanner';
import NewProductsSlider from '@/components/Slide/NewproductsSlider';
import SerisProductSlider from '@/components/Slide/SerisProductSlider';
import CollectionProductSlider from '@/components/Slide/collectionProductSlider';

export default function HomeRoot(props) {
  return (
    <div className='flex-col w-[90%]'>
      <div className='w-full pt-5'>
        <HomeBanner />
      </div>
        {props.children}
        <NewProductsSlider />
        <SerisProductSlider />
        <CollectionProductSlider />
        <NewProductsSlider />
        <NewProductsSlider />
    </div>
  );
}
