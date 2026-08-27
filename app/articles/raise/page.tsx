"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { fmt, num, taxOf } from "@/lib/tax";

export default function RaiseArticlePage() {
  const [oldNet, setOldNet] = useState("450000");
  const [newNet, setNewNet] = useState("490000");

  const oldNetN = num(oldNet);
  const newNetN = num(newNet);
  const oldTax = taxOf(oldNetN).tax;
  const newTax = taxOf(newNetN).tax;
  const raiseAmt = newNetN - oldNetN;
  const extraTax = Math.max(0, newTax - oldTax);
  const netGain = raiseAmt - extraTax;
  const keepPct = raiseAmt > 0 ? (netGain / raiseAmt) * 100 : 0;

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
        เงินเดือน · อ่าน 5 นาที
      </span>
      <h1 style={{ margin: "18px 0 20px", fontSize: 52, lineHeight: 1.1, color: "#201e1d" }}>
        เงินเดือนขึ้นแล้วภาษีขึ้นเท่าไร
      </h1>
      <p style={{ margin: "0 0 26px", font: "400 20px/1.7 var(--font-body)", color: "#474238" }}>
        หลายคนกลัวว่าขึ้นเงินเดือนแล้วจะ &quot;ตกขั้นภาษี&quot; จนเงินที่ได้เพิ่มหายไปเกือบหมด
        — ความจริงไม่ได้แย่ขนาดนั้น
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 30px" }} />

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        ภาษีที่เพิ่มคิดจากเฉพาะส่วนที่เพิ่ม
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เพราะภาษีเป็นระบบขั้นบันได เงินก้อนเดิมของคุณยังคงคิดในอัตราเดิมทุกบาท มีแค่ส่วนที่เพิ่มขึ้นมา
        เท่านั้นที่อาจขยับไปอยู่ขั้นภาษีถัดไป เงินเดือนขึ้นจึงไม่เคยทำให้เงินที่ได้รับจริงลดลง
        อย่างมากก็แค่ได้เพิ่มน้อยกว่าที่ขึ้นมาเต็ม ๆ เท่านั้นเอง
      </p>

      <div
        style={{
          background: "#ebddc5",
          borderRadius: 28,
          padding: 30,
          margin: "0 0 30px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 22, color: "#201e1d" }}>ลองใส่ตัวเลขของตัวเอง</h3>
          <p style={{ margin: 0, font: "400 14px/1.6 var(--font-body)", color: "#474238" }}>
            เงินได้สุทธิต่อปี (หลังหักค่าใช้จ่ายและค่าลดหย่อนแล้ว) ก่อนและหลังขึ้นเงินเดือน
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ font: "500 12px/1 var(--font-body)", color: "#645c50" }}>เดิม</span>
              <input
                value={oldNet}
                onChange={(e) => setOldNet(e.target.value)}
                inputMode="numeric"
                style={{
                  width: 160,
                  padding: "13px 18px",
                  borderRadius: 999,
                  border: "1px solid #c0b6a5",
                  background: "#f9f4ed",
                  font: "600 16px/1 var(--font-number)",
                  color: "#201e1d",
                  outline: "none",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ font: "500 12px/1 var(--font-body)", color: "#645c50" }}>
                หลังขึ้นเงินเดือน
              </span>
              <input
                value={newNet}
                onChange={(e) => setNewNet(e.target.value)}
                inputMode="numeric"
                style={{
                  width: 160,
                  padding: "13px 18px",
                  borderRadius: 999,
                  border: "1px solid #c0b6a5",
                  background: "#f9f4ed",
                  font: "600 16px/1 var(--font-number)",
                  color: "#201e1d",
                  outline: "none",
                }}
              />
            </label>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            paddingTop: 6,
            borderTop: "1px solid #dcd3c4",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
              เงินเดือนขึ้น
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#201e1d" }}>
              ฿{fmt(Math.max(0, raiseAmt))}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
              ภาษีเพิ่ม
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#8c491a" }}>
              ฿{fmt(extraTax)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
              ได้เพิ่มจริงในกระเป๋า
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#56633f" }}>
              ฿{fmt(Math.max(0, netGain))} ({keepPct.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        แล้วอะไรที่ควรระวังจริง ๆ
      </h2>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        คนที่รู้สึกว่า &quot;ขึ้นเงินเดือนแล้วเงินไม่ต่างเลย&quot; ส่วนใหญ่ไม่ได้เจอปัญหาภาษี
        แต่เจอปัญหารายจ่ายที่โตตามรายได้ไปด้วย — ยิ่งได้เพิ่ม ยิ่งใช้จ่ายเพิ่มตาม จนสุดท้ายเหลือเก็บ
        เท่าเดิมหรือน้อยลง ซึ่งเป็นคนละเรื่องกับภาษีเลย
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
            เงินเดือนขึ้นไม่เคยทำให้เงินที่ได้รับจริงลดลง ภาษีกินแค่ส่วนที่เพิ่มบางส่วนเท่านั้น
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
            ติดตามทั้งรายได้และรายจ่ายในที่เดียว
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
            เห็นชัดว่าเงินที่ขึ้นมา ไปอยู่ตรงไหนบ้างจริง ๆ
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
