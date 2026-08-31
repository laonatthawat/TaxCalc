import Link from "next/link";
import Icon from "@/components/Icon";

// ตัวเลขในหัวข้อการ์ด (h3) ต้องแยก font เป็น var(--font-number) เอง ไม่งั้นจะดันไปใช้ฟอนต์หัวข้อ (Caprasimo) แทน
function TitleWithNumberFont({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} style={{ fontFamily: "var(--font-number)" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

const FEATURES = [
  {
    icon: "wallet",
    title: "บันทึกรายรับตามมาตรา 40",
    body: "จดได้ในสามวินาที เลือกประเภทเงินได้ให้ตรง ระบบหักค่าใช้จ่ายเหมาให้ถูกอัตโนมัติ",
    note: "ไม่ต้องผูกบัญชีธนาคาร",
  },
  {
    icon: "percent",
    title: "คำนวณภาษีแบบเห็นวิธีคิด",
    body: "ไม่ได้โผล่มาแค่ยอดสุดท้าย แต่ไล่ให้ดูทีละขั้นว่าหักอะไรออกไปบ้าง และคุณอยู่ขั้นภาษีไหน",
    note: "อัปเดตทันทีเมื่อรายได้เปลี่ยน",
  },
  {
    icon: "scissors",
    title: "ตัวช่วยเลือกค่าลดหย่อน",
    body: "บอกว่าถ้าซื้อกองทุนหรือประกันเพิ่มอีกเท่านี้ ภาษีจะลดลงกี่บาท ก่อนที่คุณจะตัดสินใจซื้อ",
    note: "เห็นผลก่อนจ่ายเงิน",
  },
  {
    icon: "download",
    title: "ส่งออกข้อมูลได้ตลอด",
    body: "ดาวน์โหลดเป็นไฟล์ตารางไปให้นักบัญชีหรือเก็บไว้เอง ข้อมูลเป็นของคุณ ไม่ได้ติดอยู่ในแอปเรา",
    note: "ได้จัดการตัวเลข",
  },
];

const SETUP_FACTS = [
  { label: "กรอกครั้งแรก", value: "2 นาที" },
  { label: "ช่องที่บังคับกรอก", value: "1 ช่อง" },
  { label: "ค่าใช้จ่าย", value: "ฟรี" },
];

export default function FeaturesPage() {
  return (
    <div style={{ maxWidth: 1600, padding: "clamp(44px,6vw,72px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
      <p
        style={{
          margin: "0 0 16px",
          font: "600 12px/1 var(--font-body)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#82796a",
        }}
      >
        เว็บนี้ทำอะไรได้
      </p>
      <h1 style={{ margin: "0 0 18px", maxWidth: "22ch", fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.08, color: "#201e1d" }}>
        สี่อย่าง ไม่มากกว่านั้น
      </h1>
      <p style={{ margin: "0 0 clamp(30px,4vw,44px)", maxWidth: "56ch", fontSize: "clamp(16px,1.4vw,18px)", fontWeight: 400, lineHeight: 1.7, color: "#474238" }}>
        เราตัดฟีเจอร์ที่ทำให้แอปบัญชีน่ากลัวออกไปหมด เหลือเท่าที่คนเงินเดือนคนหนึ่งต้องใช้จริง
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,32px)", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 520px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, minWidth: 0 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "clamp(24px,3vw,32px)",
                borderRadius: 28,
                background: "#f9f4ed",
                border: "1px solid #dcd3c4",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  background: "#ffe1d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={f.icon} style={{ width: 22, height: 22, color: "#8c491a" }} />
              </span>
              <h3 style={{ margin: 0, fontSize: "clamp(20px,2vw,24px)", lineHeight: 1.2, color: "#201e1d" }}>
                <TitleWithNumberFont text={f.title} />
              </h3>
              <p style={{ margin: 0, font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>{f.body}</p>
              <span style={{ marginTop: 4, font: "500 13px/1.5 var(--font-body)", color: "#56633f" }}>{f.note}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "sticky", top: 86, display: "flex", flexDirection: "column", gap: 16, flex: "1 1 320px", minWidth: 0, maxWidth: 380 }}>
          <div style={{ padding: "clamp(22px,3vw,30px)", borderRadius: 28, background: "#ebddc5", display: "flex", flexDirection: "column", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 22, color: "#201e1d" }}>ที่เราไม่ทำ</h3>
            <p style={{ margin: 0, font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>
              ไม่ยื่นภาษีแทนคุณ ไม่ขายประกัน ไม่ต่อบัญชีธนาคารมาดูดรายการ ตัวเลขทุกอย่างคุณเป็นคนใส่ และลบทิ้งได้ทุกเมื่อ
            </p>
          </div>
          <div style={{ padding: "clamp(22px,3vw,30px)", borderRadius: 28, background: "#f9f4ed", border: "1px solid #dcd3c4", display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ font: "600 12px/1 var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", color: "#82796a" }}>
              ใช้เวลาตั้งค่า
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SETUP_FACTS.map((s) => (
                <div
                  key={s.label}
                  style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, paddingBottom: 12, borderBottom: "1px solid #e6dccc" }}
                >
                  <span style={{ font: "400 14px/1.5 var(--font-body)", color: "#645c50" }}>{s.label}</span>
                  <span style={{ font: "600 16px/1 var(--font-number)", color: "#201e1d" }}>{s.value}</span>
                </div>
              ))}
            </div>
            <Link
              href="/login?mode=signup"
              style={{
                textAlign: "center",
                padding: 14,
                borderRadius: 999,
                background: "#c67139",
                font: "600 15px/1 var(--font-body)",
                color: "#f5ead8",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              ลองใช้เลย
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
