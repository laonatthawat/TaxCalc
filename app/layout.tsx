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
  title: "จ่ายจนเจ็บ — จัดการการเงินส่วนตัวครบวงจร",
  description:
    "แอปจัดการการเงินส่วนตัว ติดตามรายจ่ายประจำ รายรับ วางแผนการลงทุนด้วยเครื่องคำนวณดอกเบี้ยทบต้น และประมาณการภาษีเงินได้บุคคลธรรมดา ไว้ในที่เดียว ก่อนจะจ่ายจนเจ็บ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
