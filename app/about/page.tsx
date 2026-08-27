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
    <div style={{ padding: "72px 42px 88px", maxWidth: 820 }}>
      <p
        style={{
          margin: "0 0 16px",
          font: "600 12px/1 var(--font-number)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#82796a",
        }}
      >
        ทำไมทำแอปนี้
      </p>
      <h1 style={{ margin: "0 0 24px", maxWidth: "22ch", fontSize: 56, lineHeight: 1.08, color: "#201e1d" }}>
        ผมเป็นนักศึกษาจบใหม่
      </h1>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 19px/1.75 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        พึ่งเคยทำงานที่แรก เราเปิดแบบฟอร์มยื่นภาษีแล้วก็ปิดมันไป ไม่ใช่เพราะขี้เกียจ
        แต่เพราะไม่มีใครเคยอธิบายว่าช่องพวกนั้นหมายถึงอะไร สุดท้ายก็คำนวนภาษีไม่เป็น
      </p>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 19px/1.75 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        แอปการเงินที่มีอยู่มักคิดว่าคุณรู้ศัพท์อยู่แล้ว มันให้ช่องกรอกกับกราฟสวย ๆ
        แต่ไม่บอกว่าทำไมต้องกรอก เราเลยทำอีกแบบ — ทุกช่องที่ให้คุณกรอก
        จะมีคำอธิบายอยู่ข้าง ๆ ว่ามันไปโผล่ที่ไหนในตัวเลขสุดท้าย
      </p>
      <p
        style={{
          margin: "0 0 36px",
          font: "400 19px/1.75 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เป้าหมายของเราแปลก ๆ หน่อย คือเราอยากให้คุณเข้าใจภาษีดีพอที่จะไม่ต้องใช้แอปเราก็ได้
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {BELIEFS.map((b) => (
          <div
            key={b.title}
            style={{
              padding: "24px 0",
              borderTop: "1px solid #dcd3c4",
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            <Icon
              name={b.icon}
              style={{ width: 22, height: 22, color: "#8c491a", flexShrink: 0, marginTop: 3 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ font: "600 20px/1.3 var(--font-body)", color: "#201e1d" }}>
                {b.title}
              </span>
              <span style={{ font: "400 15px/1.7 var(--font-body)", color: "#474238" }}>
                {b.body}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
