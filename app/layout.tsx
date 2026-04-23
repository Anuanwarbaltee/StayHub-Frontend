import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactqueryProviders from "./queryprovider";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "./redux/reduxprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stay Hub",
  description: "Multi Booking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ReactqueryProviders>
            {children}
            <Toaster position="top-right" />
          </ReactqueryProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
