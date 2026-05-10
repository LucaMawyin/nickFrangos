import "./global.css";
import NavBar from "@/components/NavBar";
import { pages } from "@/lib/pages"; 

export const metadata = {
    title: "Nicholas Frangos",
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
        {children}
      </body>
    </html>
  );
}
