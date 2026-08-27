import Link from "next/link";
import Icon from "@/components/Icon";

const COLS = [
  {
    head: "เว็บไซต์",
    links: [
      { label: "หน้าแรก", href: "/" },
      { label: "ฟีเจอร์", href: "/features" },
      { label: "คลังบทความ", href: "/articles" },
    ],
  },
  {
    head: "เกี่ยวกับ",
    links: [
      { label: "ทำไมทำแอปนี้", href: "/about" },
      { label: "คำถามที่พบบ่อย", href: "/faq" },
      { label: "เริ่มใช้ฟรี", href: "/signup" },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer
      style={{
        padding: "44px 42px",
        background: "#2e2b25",
        color: "#eee7db",
        display: "flex",
        gap: 36,
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 9, maxWidth: "38ch" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "#c67139",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="sprout" style={{ width: 15, height: 15, color: "#f5ead8" }} />
          </span>
          <span style={{ font: "600 16px/1 var(--font-body)" }}>จ่ายจนเจ็บ</span>
        </div>
        <p style={{ margin: 0, font: "400 13px/1.7 var(--font-body)", color: "#c0b6a5" }}>
          ข้อมูลในเว็บนี้เป็นการอธิบายทั่วไป ไม่ใช่คำแนะนำทางภาษีรายบุคคล
          ตัวเลขอัตราภาษีอ้างอิงเกณฑ์ปีล่าสุด ควรตรวจกับกรมสรรพากรก่อนยื่นจริง
        </p>
      </div>
      <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
        {COLS.map((col) => (
          <div key={col.head} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span
              style={{
                font: "600 11px/1 var(--font-number)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#a19786",
              }}
            >
              {col.head}
            </span>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  textAlign: "left",
                  font: "400 14px/1.6 var(--font-body)",
                  color: "#eee7db",
                  cursor: "pointer",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
