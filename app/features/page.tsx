import Link from "next/link";
import Icon from "@/components/Icon";

const FEATURES = [
  {
    icon: "wallet",
    title: "บันทึกรายรับรายจ่าย",
    body: "จดได้ในสามวินาที มีหมวดที่ตั้งเองได้ และเห็นยอดคงเหลือของเดือนนี้ตลอด",
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
    note: "ลบบัญชีได้จริงในหนึ่งคลิก",
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ padding: "72px 42px 88px", maxWidth: 1120 }}>
      <p
        style={{
          margin: "0 0 16px",
          font: "600 12px/1 var(--font-number)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#82796a",
        }}
      >
        แอปนี้ทำอะไรได้
      </p>
      <h1 style={{ margin: "0 0 20px", maxWidth: "22ch", fontSize: 56, lineHeight: 1.08, color: "#201e1d" }}>
        สี่อย่าง ไม่มากกว่านั้น
      </h1>
      <p
        style={{
          margin: "0 0 44px",
          maxWidth: "56ch",
          font: "400 18px/1.7 var(--font-body)",
          color: "#474238",
        }}
      >
        เราตัดฟีเจอร์ที่ทำให้แอปบัญชีน่ากลัวออกไปหมด เหลือเท่าที่คนเงินเดือนคนหนึ่งต้องใช้จริง
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
        {FEATURES.map((f) => (
          <div
            key={f.title}
            style={{
              padding: 32,
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
            <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1.2, color: "#201e1d" }}>{f.title}</h3>
            <p style={{ margin: 0, font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>
              {f.body}
            </p>
            <span style={{ marginTop: 4, font: "500 13px/1.5 var(--font-body)", color: "#56633f" }}>
              {f.note}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          padding: 32,
          borderRadius: 28,
          background: "#ebddc5",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "52ch", display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 24, color: "#201e1d" }}>ที่เราไม่ทำ</h3>
          <p style={{ margin: 0, font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>
            ไม่ยื่นภาษีแทนคุณ ไม่ขายประกัน ไม่ต่อบัญชีธนาคารมาดูดรายการ ตัวเลขทุกอย่างคุณเป็นคนใส่
            และลบทิ้งได้ทุกเมื่อ
          </p>
        </div>
        <Link
          href="/signup"
          style={{
            padding: "15px 28px",
            borderRadius: 999,
            background: "#c67139",
            font: "600 15px/1 var(--font-body)",
            color: "#f5ead8",
            cursor: "pointer",
          }}
        >
          ลองใช้เลย ฟรี
        </Link>
      </div>
    </div>
  );
}
