import "./global.css";
import NavBar from "@/components/NavBar";

const pages = ["about", "articles"];

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
