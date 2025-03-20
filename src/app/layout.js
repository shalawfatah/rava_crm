import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { Menubar } from "primereact/menubar";
import { items } from "@/app/utils/menuItems";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "پەیمانگای راڤە",
  description: "پەیمانگای راڤە لە سلێمانی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-indigo-500`}
      >

    <div dir="rtl">
        <Menubar model={items}  />
        </div>
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </body>
    </html>
  );
}
