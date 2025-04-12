import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "./components/ClientLayout";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Image Gallery App",
  description: "A simple image gallery with upload and delete functionality",
  icons: {
    icon: "/ntp.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
