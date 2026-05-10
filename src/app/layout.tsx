import "./global.css";
import NavBar from "@/components/NavBar";

const pages = [
  { title: "About", href: "#about", requireLogin : false },
  { title: "Articles", href: "articles",requireLogin : false },
  { title: "Write", href: "articles/create-article", requireLogin : true },
  { title: "Logout", href: "logout", requireLogin : true },
];

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
