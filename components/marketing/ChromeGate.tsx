import MarketingNav from "./Nav";
import MarketingFooter from "./Footer";

// Nav บนกับ Footer ล่างของเว็บ ใส่ทุกหน้าเหมือนกันหมด (auth, หน้ารายรับ/ภาษี, 404 ฯลฯ)
// เพื่อให้กดกลับหน้าแรกได้จากทุกที่ ไม่ใช่แค่หน้า marketing เท่านั้น
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#201e1d" }}>
      <MarketingNav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      <MarketingFooter />
    </div>
  );
}
