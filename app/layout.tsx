import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/marketing/ChromeGate";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  title: "จ่ายจนเจ็บ — บันทึกรายรับ ประมาณภาษีให้เห็นทุกขั้น",
  description:
    "แอปบันทึกรายรับตามประเภทเงินได้ และประมาณการภาษีเงินได้บุคคลธรรมดาให้เห็นทุกขั้นตอนการคำนวณ ไว้ในที่เดียว ก่อนจะจ่ายจนเจ็บ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${ibmPlexSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
