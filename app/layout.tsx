import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "จ่ายจนเจ็บ — ติดตามรายจ่ายประจำของคุณ",
  description:
    "แอปคำนวณรายจ่ายประจำรายเดือน/รายปี (ค่าเช่า ค่าน้ำค่าไฟ ค่าผ่อน subscription ฯลฯ) พร้อมแจ้งเตือนก่อนถึงกำหนดจ่าย ก่อนจะจ่ายจนเจ็บ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
