"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function FreelanceArticlePage() {
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
        ฟรีแลนซ์ · อ่าน 9 นาที
      </span>
      <h1 style={{ margin: "18px 0 20px", fontSize: 52, lineHeight: 1.1, color: "#201e1d" }}>
        ฟรีแลนซ์ต้องทำอะไรต่างจากพนักงานประจำ
      </h1>
      <p style={{ margin: "0 0 26px", font: "400 20px/1.7 var(--font-body)", color: "#474238" }}>
        ไม่มีฝ่ายบุคคลคอยหักภาษีให้ทุกเดือน ฟรีแลนซ์ต้องดูแลเรื่องภาษีเองเกือบทั้งหมด
        — นี่คือสามจุดที่ต่างจากมนุษย์เงินเดือนชัดที่สุด
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 30px" }} />

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        1. ไม่มีใครหักเงินกันไว้จ่ายภาษีให้อัตโนมัติ
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        ลูกค้าบางรายอาจหัก ณ ที่จ่าย 3% ให้ตอนโอนเงิน (แล้วออกหนังสือรับรองการหักภาษีมาให้)
        แต่ไม่ใช่ทุกเจ้าที่ทำแบบนี้ และ 3% ที่หักไว้มักไม่พอกับภาษีที่ต้องจ่ายจริงเมื่อรายได้สูงขึ้น
        ฟรีแลนซ์จึงควรกันเงินส่วนหนึ่งไว้เผื่อจ่ายภาษีเองล่วงหน้า แทนที่จะรอให้เงินหมดตอนยื่นจริง
      </p>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        2. ต้องยื่นภาษี 2 รอบต่อปี ไม่ใช่รอบเดียว
      </h2>
      <p style={{ margin: "0 0 20px", font: "400 17px/1.8 var(--font-body)", color: "#474238" }}>
        พนักงานประจำยื่นปีละครั้ง แต่คนมีเงินได้ประเภทฟรีแลนซ์/อาชีพอิสระต้องยื่นเพิ่มอีกรอบกลางปี:
      </p>
      <div
        style={{
          background: "#ebddc5",
          borderRadius: 28,
          padding: 28,
          margin: "0 0 30px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ font: "600 16px/1.35 var(--font-body)", color: "#201e1d" }}>
            ภ.ง.ด. 94 — ยื่นกลางปี
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#474238" }}>
            สรุปรายได้เดือน ม.ค.–มิ.ย. ยื่นภายในเดือนกันยายนของปีนั้น
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ font: "600 16px/1.35 var(--font-body)", color: "#201e1d" }}>
            ภ.ง.ด. 90 — ยื่นปลายปี
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#474238" }}>
            สรุปรายได้ทั้งปี ยื่นภายในเดือนมีนาคมของปีถัดไป — ภาษีที่จ่ายไปแล้วตอนกลางปี
            เอามาหักลบออกจากยอดที่ต้องจ่ายรอบนี้ได้
          </span>
        </div>
      </div>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        3. หักค่าใช้จ่ายได้คนละแบบกับเงินเดือน
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เงินเดือนพนักงานหักค่าใช้จ่ายแบบเหมา 50% (ไม่เกิน ฿100,000) แต่เงินได้ฟรีแลนซ์แบ่งเป็นหลาย
        ประเภทตามลักษณะงาน เช่น วิชาชีพอิสระบางสาขาหักเหมาได้ 30% ส่วนงานรับเหมา/ค้าขายหักเหมาได้
        ถึง 60% หรือจะเลือกหักตามค่าใช้จ่ายจริง (ต้องมีหลักฐาน) แทนแบบเหมาก็ได้ถ้าคำนวณแล้วคุ้มกว่า
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
            ฟรีแลนซ์ต้องกันเงินเผื่อภาษีเอง ยื่นสองรอบ และหักค่าใช้จ่ายคนละสูตรกับพนักงานประจำ
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
            บันทึกรายได้แต่ละงานไว้ที่เดียว
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
            เห็นยอดรวมทั้งปีและภาษีที่ต้องกันไว้ ก่อนถึงรอบยื่นจริง
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
