import { createClient } from "@/lib/supabase/server";
import MarketingNav from "./Nav";
import MarketingFooter from "./Footer";

// Nav บนกับ Footer ล่างของเว็บ ใส่ทุกหน้าเหมือนกันหมด (auth, หน้ารายรับ/ภาษี, 404 ฯลฯ)
// เช็ค session ที่นี่แล้วส่งอีเมลลงไปให้ Nav โชว์เมนูของคน login/ไม่ login ให้ถูกแบบ
export default async function ChromeGate({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#201e1d" }}>
      <MarketingNav userEmail={user?.email ?? null} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      <MarketingFooter />
    </div>
  );
}
