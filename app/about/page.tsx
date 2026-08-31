import Link from "next/link";
import Icon from "@/components/Icon";

const BELIEFS = [
  {
    icon: "eye",
    title: "ทุกตัวเลขต้องบอกที่มาได้",
    body: "ถ้าแอปโชว์ยอดภาษีแล้วคุณกดดูไม่ได้ว่ามาจากไหน นั่นคือแอปที่ยังทำงานไม่เสร็จ",
  },
  {
    icon: "feather",
    title: "กรอกน้อยที่สุดที่ยังมีประโยชน์",
    body: "เราถามแค่เงินเดือนก้อนเดียวก็พอเริ่มได้ ที่เหลือค่อยเติมรายรับอื่นเมื่อคุณอยากละเอียดขึ้น",
  },
  {
    icon: "lock",
    title: "ข้อมูลการเงินเป็นเรื่องส่วนตัว",
    body: "ไม่ขาย ไม่แชร์ ไม่เอาไปยิงโฆษณา และลบได้จริงเมื่อคุณอยากเลิกใช้",
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 1600, padding: "clamp(44px,6vw,72px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,64px)", alignItems: "flex-end", paddingBottom: "clamp(28px,4vw,44px)" }}>
        <div style={{ flex: "1 1 440px", minWidth: 0, maxWidth: 660 }}>
          <p
            style={{
              margin: "0 0 16px",
              font: "600 12px/1 var(--font-body)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#82796a",
            }}
          >
            ทำไมทำเว็บนี้
          </p>
          <h1 style={{ margin: 0, maxWidth: "20ch", fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.08, color: "#201e1d" }}>
            ผมเป็นนักศึกษาจบใหม่
          </h1>
        </div>
        <p style={{ flex: "1 1 380px", minWidth: 0, maxWidth: 600, margin: 0, fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 400, lineHeight: 1.75, color: "#474238", textWrap: "pretty" }}>
          พึ่งเคยทำงานที่แรก ผมเปิดแบบฟอร์มยื่นภาษีแล้วก็ปิดมันไป ไม่ใช่เพราะขี้เกียจ
          แต่เพราะไม่มีใครเคยอธิบายว่าช่องพวกนั้นหมายถึงอะไร สุดท้ายก็คำนวณภาษีไม่เป็น
        </p>
      </div>

      <div style={{ borderTop: "1px solid #dcd3c4", paddingTop: "clamp(26px,3vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
        <p style={{ margin: 0, fontSize: "clamp(15px,1.4vw,17px)", fontWeight: 400, lineHeight: 1.8, color: "#474238", textWrap: "pretty" }}>
          แอปการเงินที่มีอยู่มักคิดว่าคุณรู้ศัพท์อยู่แล้ว มันให้ช่องกรอกกับกราฟสวย ๆ
          แต่ไม่บอกว่าทำไมต้องกรอก เราเลยทำอีกแบบ — ทุกช่องที่ให้คุณกรอก
          จะมีคำอธิบายอยู่ข้าง ๆ ว่ามันไปโผล่ที่ไหนในตัวเลขสุดท้าย
        </p>
        <p style={{ margin: 0, fontSize: "clamp(15px,1.4vw,17px)", fontWeight: 400, lineHeight: 1.8, color: "#474238", textWrap: "pretty" }}>
          ผมทำเว็ปนี้เพื่อคนที่เพิ่งเริ่มทำงานที่แรก คนที่ยังไม่เคยยื่นภาษีสักครั้ง
          และคนที่ยื่นมาหลายปีแล้วแต่ยังไม่แน่ใจว่าตัวเลขที่กรอกไปถูกไหม
          เป้าหมายเดียวคือให้ทุกคนเข้าใจภาษีของตัวเองได้ถูกต้อง ไม่ใช่แค่กรอกตามที่เขาบอก
        </p>
        <blockquote style={{ margin: 0, padding: "clamp(22px,3vw,30px)", borderRadius: 28, background: "#ebddc5", fontSize: "clamp(19px,2vw,24px)", fontWeight: 600, lineHeight: 1.45, color: "#201e1d" }}>
          เป้าหมายของผม คือผมอยากให้ภาษี
          <br />
          เป็นเรื่องใกล้ตัวคุณ
        </blockquote>
      </div>

      <h2 style={{ margin: "clamp(44px,6vw,72px) 0 clamp(20px,3vw,28px)", fontSize: "clamp(27px,3.4vw,38px)", lineHeight: 1.15, color: "#201e1d" }}>
        เราเชื่อสามข้อนี้
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {BELIEFS.map((b) => (
          <div
            key={b.title}
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
              <Icon name={b.icon} style={{ width: 22, height: 22, color: "#8c491a" }} />
            </span>
            <span style={{ fontSize: "clamp(18px,1.8vw,21px)", fontWeight: 600, lineHeight: 1.3, color: "#201e1d" }}>
              {b.title}
            </span>
            <span style={{ font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>{b.body}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "clamp(24px,3vw,32px)",
          borderRadius: 28,
          border: "1px solid #dcd3c4",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "52ch" }}>
          <span style={{ fontSize: "clamp(18px,1.8vw,21px)", fontWeight: 600, lineHeight: 1.35, color: "#201e1d" }}>
            อยากลองก่อนอ่านให้จบก็ได้
          </span>
          <span style={{ font: "400 15px/1.65 var(--font-body)", color: "#645c50" }}>
            ใส่เงินเดือนช่องเดียว แล้วดูว่าปีนี้ภาษีของคุณอยู่ตรงไหน
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/login?mode=signup"
            style={{ padding: "15px 28px", borderRadius: 999, background: "#c67139", font: "600 15px/1 var(--font-body)", color: "#f5ead8", cursor: "pointer", textDecoration: "none" }}
          >
            เริ่มใช้ฟรี
          </Link>
          <Link
            href="/faq"
            style={{ padding: "15px 26px", borderRadius: 999, border: "1px solid #c0b6a5", background: "transparent", font: "600 15px/1 var(--font-body)", color: "#474238", cursor: "pointer", textDecoration: "none" }}
          >
            อ่านคำถามที่พบบ่อย
          </Link>
        </div>
      </div>
    </div>
  );
}
