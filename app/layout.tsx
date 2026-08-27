import type { Metadata } from "next";
import { Caprasimo, Figtree, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import ChromeGate from "@/components/marketing/ChromeGate";

const caprasimo = Caprasimo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caprasimo",
});

const figtree = Figtree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-figtree",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  title: "จ่ายจนเจ็บ — จัดการการเงินส่วนตัวครบวงจร",
  description:
    "แอปจัดการการเงินส่วนตัว ติดตามรายจ่ายประจำ รายรับ และประมาณการภาษีเงินได้บุคคลธรรมดาจากข้อมูลจริง ไว้ในที่เดียว ก่อนจะจ่ายจนเจ็บ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${caprasimo.variable} ${figtree.variable} ${ibmPlexSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
