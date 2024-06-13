import Header from "@/components/Header";
import Nav from "@/components/Nav";
// import RequireAuth from "@/components/auth/requireAuth";

export default function CenteredLayout(props) {
  return (
    <div className="">
      <Header />
      <main className="flex pt-[--header-height]">
        <Nav />
        <div className='w-[calc(100%-250px)] flex justify-center'>
          {/* <RequireAuth> */}
        {props.children}
            {/* </RequireAuth> */}
        </div>
      </main>
    </div>
  );
}
