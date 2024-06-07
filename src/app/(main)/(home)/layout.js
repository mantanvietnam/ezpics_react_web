import HomeBanner from "@/components/HomeBanner";
import {
  NewProductsSlider,
  TrendingSlider,
  TrySlider,
  SocialSlider,
} from "@/components/Slide/ListSlider";

export default function HomeRoot(props) {
  return (
    <>
      <div className="w-5/6 m-5">
        <HomeBanner />
        <NewProductsSlider />
        <TrySlider />
        <TrendingSlider />
        <SocialSlider />
      </div>
    </>
  );
}
