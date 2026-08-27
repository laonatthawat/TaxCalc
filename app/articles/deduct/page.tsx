"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

const FREE_ITEMS = [
  { label: "ส่วนตัว", value: "฿60,000" },
  { label: "คู่สมรส (ไม่มีรายได้ ยื่นรวม)", value: "฿60,000" },
  { label: "บุตร คนละ", value: "฿30,000 (฿60,000 ถ้าเกิดปี 2561 เป็นต้นไป)" },
  { label: "พ่อแม่ คนละ (สูงสุด 4 คน)", value: "฿30,000" },
  { label: "ประกันสังคม", value: "สูงสุด ฿9,000" },
];

const EXTRA_ITEMS = [
  { label: "ประกันชีวิต + สุขภาพตัวเอง", value: "รวมกันไม่เกิน ฿100,000" },
  { label: "ประกันสุขภาพพ่อแม่", value: "ไม่เกิน ฿15,000" },
  { label: "กองทุน PVD / RMF / SSF / Thai ESG", value: "รวมกันไม่เกิน ฿500,000" },
  { label: "ดอกเบี้ยกู้ซื้อบ้าน", value: "ไม่เกิน ฿100,000" },
  { label: "เงินบริจาค", value: "ไม่เกิน 10% ของเงินได้หลังหักรายการอื่น" },
];

export default function DeductArticlePage() {
  return (
    <div style={{ padding: "48px 42px 88px", maxWidth: 760 }}>
      <Link
        href="/articles"
        style={{
          display: "inline-block",
          marginBottom: 30,
          font: "500 14px/1 var(--font-body)",
          color: "#8c491a",
          cursor: "pointer",
        }}
      >
        ← กลับไปคลังบทความ
      </Link>
      <span
        style={{
          display: "inline-block",
          padding: "6px 13px",
          borderRadius: 999,
          background: "#ffe1d0",
          font: "600 11px/1.4 var(--font-body)",
          color: "#8c491a",
        }}
      >
        ลดหย่อน · อ่าน 8 นาที
      </span>
      <h1 style={{ margin: "18px 0 20px", fontSize: 52, lineHeight: 1.1, color: "#201e1d" }}>
        ลดหย่อนมีอะไรบ้าง เลือกอันไหนก่อน
      </h1>
      <p style={{ margin: "0 0 26px", font: "400 20px/1.7 var(--font-body)", color: "#474238" }}>
        ค่าลดหย่อนมีเป็นสิบรายการ แต่ไม่ต้องรู้ทุกอันก็ได้ — เรียงจาก &quot;ได้มาฟรี ไม่ต้องทำอะไร&quot;
        ไปถึง &quot;ต้องจ่ายเพิ่มถึงจะได้&quot; ให้เห็นภาพว่าอันไหนควรดูก่อน
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 30px" }} />

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        ลดหย่อนคืออะไร ทำไมต้องมี
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        หลังหักค่าใช้จ่ายตามกฎหมายแล้ว (เช่นพนักงานประจำหักได้ 50% ไม่เกิน ฿100,000) ตัวเลขที่เหลือยังลด
        ได้อีกชั้นหนึ่งด้วย &quot;ค่าลดหย่อน&quot; — รายการที่รัฐอนุญาตให้หักออกก่อนคำนวณภาษี แต่ละ
        รายการมีเพดานของตัวเองแยกกัน ยิ่งใช้สิทธิ์ครบ เงินได้สุทธิที่ต้องเสียภาษีก็ยิ่งน้อยลง
      </p>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        กลุ่มที่ได้มาฟรี ไม่ต้องทำอะไรเพิ่ม
      </h2>
      <p style={{ margin: "0 0 20px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        รายการเหล่านี้ได้สิทธิ์ตามสถานะตัวเองอยู่แล้ว ไม่ต้องซื้อหรือจ่ายอะไรเพิ่ม แค่กรอกให้ครบ
      </p>
      <div
        style={{
          background: "#ebddc5",
          borderRadius: 28,
          padding: 28,
          margin: "0 0 30px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {FREE_ITEMS.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 0",
              borderTop: i === 0 ? "none" : "1px solid #dcd3c4",
            }}
          >
            <span style={{ font: "400 15px/1.5 var(--font-body)", color: "#474238" }}>
              {item.label}
            </span>
            <span
              style={{
                font: "600 15px/1.5 var(--font-number)",
                color: "#201e1d",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        กลุ่มที่ต้องจ่ายเพิ่มถึงจะได้สิทธิ์
      </h2>
      <p style={{ margin: "0 0 20px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        รายการเหล่านี้ต้องซื้อ/จ่ายจริงก่อนถึงเอามาลดหย่อนได้ — เหมาะกับคนที่มีเงินเหลือแล้วอยากวางแผน
        ภาษีเพิ่มเติม
      </p>
      <div
        style={{
          background: "#ebddc5",
          borderRadius: 28,
          padding: 28,
          margin: "0 0 30px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {EXTRA_ITEMS.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 0",
              borderTop: i === 0 ? "none" : "1px solid #dcd3c4",
            }}
          >
            <span style={{ font: "400 15px/1.5 var(--font-body)", color: "#474238" }}>
              {item.label}
            </span>
            <span
              style={{
                font: "600 15px/1.5 var(--font-number)",
                color: "#201e1d",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        แล้วอันไหนคุ้มที่สุด
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เงินภาษีที่ประหยัดได้ = อัตราภาษีขั้นที่คุณอยู่ × จำนวนเงินที่ลดหย่อน ยิ่งอยู่ขั้นภาษีสูง
        ยิ่งคุ้ม เช่นถ้าคุณอยู่ขั้น 15% แล้วซื้อ SSF เพิ่ม ฿50,000 จะประหยัดภาษีได้ประมาณ ฿7,500
        แต่ถ้าอยู่ขั้น 5% เงินก้อนเดียวกันประหยัดได้แค่ประมาณ ฿2,500
      </p>
      <p style={{ margin: "0 0 26px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        เพราะฉะนั้นลำดับที่แนะนำคือ กรอกกลุ่ม &quot;ได้มาฟรี&quot; ให้ครบก่อนเสมอ แล้วค่อยดูกลุ่ม
        &quot;ต้องจ่ายเพิ่ม&quot; ตามขั้นภาษีที่คุณอยู่จริง ไม่ใช่ซื้อทุกอย่างที่มีคนแนะนำโดยไม่ดูตัวเลข
        ของตัวเอง
      </p>

      <div
        style={{
          background: "#e1eecc",
          borderRadius: 28,
          padding: 28,
          margin: "0 0 30px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <Icon
          name="lightbulb"
          style={{ width: 20, height: 20, color: "#56633f", flexShrink: 0, marginTop: 3 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ font: "600 16px/1.4 var(--font-body)", color: "#272e1b" }}>
            จำแค่ประโยคเดียว
          </span>
          <p style={{ margin: 0, font: "400 15px/1.7 var(--font-body)", color: "#272e1b" }}>
            ลดหย่อนยิ่งคุ้มเมื่อขั้นภาษีของคุณยิ่งสูง เพราะเงินที่ประหยัดได้ผูกกับอัตราภาษีขั้นนั้นตรง ๆ
          </p>
        </div>
      </div>

      <div
        style={{
          padding: 30,
          borderRadius: 28,
          border: "1px solid #dcd3c4",
          display: "flex",
          gap: 22,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "44ch", display: "flex", flexDirection: "column", gap: 7 }}>
          <span style={{ font: "600 19px/1.35 var(--font-body)", color: "#201e1d" }}>
            ไม่ต้องจำเองว่ากรอกครบหรือยัง
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
            แอปมีช่องให้กรอกครบทุกรายการ พร้อมบอกว่าอันไหนถึงเพดานแล้ว
          </span>
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
          เริ่มใช้ฟรี
        </Link>
      </div>
    </div>
  );
}
