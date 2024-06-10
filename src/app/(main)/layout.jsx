import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default function CenteredLayout(props) {
  return (
    <div className="">
      <Header />
      <main className="flex pt-[--header-height]">
        <Nav />
        <div className='w-[calc(100%-15%)] flex justify-center'>
        {props.children}
        </div>
      </main>
    </div>
  );
}
