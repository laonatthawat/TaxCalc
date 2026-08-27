"use client";

import { usePathname } from "next/navigation";
import MarketingNav from "./Nav";
import MarketingFooter from "./Footer";

// เส้นทางฝั่ง marketing เท่านั้นที่ควรมี Nav/Footer ของหน้าเว็บสาธารณะ
// หน้า auth (login/signup/...) และหน้า dashboard ชุดหลัง login มี header/chrome ของตัวเองอยู่แล้ว
// เดิมเคยแยกด้วย route group `(marketing)` แต่ Turbopack dev server (Next 16.3.2) มีบั๊ก:
// พอมี route group อยู่คู่กับ route ระดับบนสุดอื่นๆ (login, dashboard ฯลฯ) route พวกนั้นจะ 404
// ใน `next dev` เท่านั้น (ตอน `next build`/production ปกติดี) — เลยเปลี่ยนมา gate ด้วย pathname แทน
const MARKETING_PATHS = new Set(["/", "/features", "/articles", "/about", "/faq"]);

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // "/articles/xxx" ต้องขึ้นด้วย Nav/Footer เหมือนกันหมด ไม่ว่าจะมีบทความเพิ่มกี่บทความก็ตาม
  const isMarketing = MARKETING_PATHS.has(pathname) || pathname.startsWith("/articles/");

  if (!isMarketing) return <>{children}</>;

  return (
    <div style={{ minHeight: "100vh", color: "#201e1d" }}>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
