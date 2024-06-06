import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default function CenteredLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <header>
          <Header />
        </header>
        <main className="flex pt-[--header-height]">
          <nav className="">
            <Nav />
          </nav>
          <div className="content">{children}</div>
        </main>
      </body>
    </html>
  );
}
