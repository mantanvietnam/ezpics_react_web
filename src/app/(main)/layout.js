import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default function CenteredLayout(props) {
  return (
    <div className="">
      <Header />
      <main className="flex pt-[--header-height]">
        <Nav />
        {props.children}
      </main>
    </div>
  );
}
