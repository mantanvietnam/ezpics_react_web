import Header from "@/components/Header";
import Nav from "@/components/Nav";
import "@/styles/globals.scss";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Header />
        <main className="flex pt-[--header-height]">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
