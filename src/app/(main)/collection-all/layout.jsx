import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Bộ sưu tập | Ezpisc",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
  openGraph: {
    images:
      "https://admin.ezpics.vn/upload/admin/files/1587a9df872656780f37.jpg",
  },
};

export default function CollectionLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
