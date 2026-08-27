"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function BonusArticlePage() {
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
        โบนัส · อ่าน 5 นาที
      </span>
      <h1 style={{ margin: "18px 0 20px", fontSize: 52, lineHeight: 1.1, color: "#201e1d" }}>
        โบนัสถูกหักภาษีเยอะไหม
      </h1>
      <p style={{ margin: "0 0 26px", font: "400 20px/1.7 var(--font-body)", color: "#474238" }}>
        เห็นสลิปเดือนที่ได้โบนัสแล้วใจหาย เพราะยอดหัก ณ ที่จ่ายพุ่งขึ้นทันที
        แต่นั่นไม่ได้แปลว่าโบนัสโดนภาษีแพงกว่าปกติ
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 30px" }} />

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        โบนัสไม่มีอัตราภาษีของตัวเอง
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        กฎหมายไม่ได้แยก &quot;ภาษีโบนัส&quot; ออกมาต่างหาก โบนัสถูกนับรวมเป็นเงินได้ทั้งปีเหมือน
        เงินเดือนทุกบาททุกสตางค์ แล้วใช้ตารางภาษีขั้นบันไดเดียวกันกับเงินได้ก้อนอื่น ๆ ทั้งหมด
      </p>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        แล้วทำไมสลิปเดือนนั้นโดนหักเยอะจัง
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เพราะระบบหัก ณ ที่จ่ายของบริษัทประมาณรายได้ทั้งปีของคุณจาก &quot;เงินเดือนของเดือนนั้น
        คูณ 12&quot; ถ้าเดือนไหนมีโบนัสรวมอยู่ด้วย ระบบจะเข้าใจไปว่าคุณจะได้เงินก้อนขนาดนั้นทุกเดือน
        ตลอดปี ตัวเลขประมาณการเลยพุ่งสูงเกินจริง และถูกดันไปคำนวณในขั้นภาษีที่สูงกว่าที่ควรจะเป็น
      </p>
      <p style={{ margin: "0 0 26px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        ตัวอย่าง: เงินเดือน ฿30,000 ปกติหัก ณ ที่จ่ายเดือนละไม่กี่ร้อยบาท แต่เดือนที่ได้โบนัส
        ฿60,000 ระบบจะคิดว่า (฿30,000 + ฿60,000) × 12 = ฿1,080,000 ต่อปี ซึ่งสูงกว่ารายได้จริงมาก
        เดือนนั้นเลยโดนหักแรงกว่าปกติหลายเท่า
      </p>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        เงินส่วนเกินหายไปไหน
      </h2>
      <p style={{ margin: "0 0 26px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        ไม่ได้หายไปไหนครับ ตอนยื่นภาษีปลายปี ระบบจะคำนวณใหม่ทั้งหมดจากรายได้จริงตลอดทั้งปี
        (ไม่ใช่ตัวเลขประมาณการรายเดือน) ถ้ายอดที่ถูกหักไว้ระหว่างปีมากกว่าภาษีที่ต้องจ่ายจริง
        ส่วนต่างนั้นจะได้คืนกลับมาเป็นเงินคืนภาษี
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
            โบนัสไม่ได้โดนภาษีแพงกว่าเงินเดือน แค่โดนหัก ณ ที่จ่ายไว้ล่วงหน้าแรงกว่า
            แล้วส่วนเกินจะได้คืนตอนยื่นภาษี
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
            เห็นภาพรวมทั้งปี ไม่ต้องคำนวณเอง
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
            ใส่เงินเดือนกับโบนัสไว้ แอปคำนวณภาษีที่ต้องเสียจริงทั้งปีให้
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
