import Footer from "@/components/Footer";
import "./global.css";
import NavBar from "@/components/NavBar";
import { pages } from "@/lib/pages"; 
import { NotificationProvider } from "@/components/NotificationProvider";
import { getLinks } from "@/lib/getLinks";
import { SocialLink } from "@/lib/types";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const links = await getLinks();

    return (
        <html lang="en">
            <body>
                <NotificationProvider>
                    <NavBar pageList={pages}/>
                    <div className="
                        pt-[10vh] 
                        min-h-[90vh] 
                        flex-1 
                        flex
                        flex-col
                    ">
                        {children}
                    </div>
                    <Footer links={links as SocialLink[]}/>                    
                </NotificationProvider>

            </body>
        </html>
    );
}
