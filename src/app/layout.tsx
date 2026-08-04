import Footer from "@/components/Footer";
import "./global.css";
import NavBar from "@/components/NavBar";
import { pages } from "@/lib/pages"; 

export const metadata = {
  title: "Nicholas Frangos",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar pageList={pages}/>
        <div className="pt-[10vh] flex-1 flex flex-col">
          {children}
        </div>
        <Footer/>
      </body>
    </html>
  );
}
