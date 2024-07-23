import Providers from "../redux/Provider";
import "@/styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Ezpics",
  description: "Ezpics - Dùng là thích",
  icons: {
    icon: "/images/EZPICS.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
          <ToastContainer theme="colored" />
        </Providers>
      </body>
    </html>
  );
}
