import HomeBanner from '@/components/HomeBanner';
import EndowProduct from '@/components/Slide/EndowProduct';
import EventProductSlider from '@/components/Slide/EventProductSlider';
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
        <EndowProduct />
        <EventProductSlider />
    </div>
  );
}
