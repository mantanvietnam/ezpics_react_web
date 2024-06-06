import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import NewProductsSlider from "@/components/Slide/NewproductsSlider";

export default function Home() {
  return (
    <>
      {/* <div>
        <Link href={"/sign-in"}>sign_in</Link>
      </div>
      <div>
        <Link href={"/sign-up"}>sign_up</Link>
      </div> */}
      <NewProductsSlider />
      <ToastContainer />
    </>
  );
}
