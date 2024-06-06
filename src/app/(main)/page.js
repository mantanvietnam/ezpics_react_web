import Image from "next/image";
import Link from "next/link";
import Slide from "@/components/Slide";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="">
      Home
      <div>
        <Link href={"/sign-in"}>sign_in</Link>
      </div>
      <div>
        <Link href={"/sign-up"}>sign_up</Link>
      </div>
      <Slide />
      <ToastContainer />
    </div>
  );
}
