import {
  NewProductsSlider,
  TrySlider,
  TrendingSlider,
} from "@/components/Slide/ListSlider";

export default function Home() {
  return (
    <>
      <div className="slider w-5/6">
        <NewProductsSlider />
        <TrySlider />
        <TrendingSlider />
      </div>
    </>
  );
}
