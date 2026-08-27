"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { SAGE, ACC, fmt, num, taxOf, BR } from "@/lib/tax";

export default function LadderArticlePage() {
  const [net, setNet] = useState("450000");

  const netN = num(net);
  const r = taxOf(netN);
  const brackets = r.rows.map((row, i) => ({
    key: i,
    label: row.b.label,
    rate: (row.b.rate * 100).toFixed(0) + "%",
    taxLabel: row.t > 0 ? "฿" + fmt(row.t) : "฿0",
    fill: row.fill.toFixed(1) + "%",
    barBg: row.b.rate === 0 ? SAGE : ACC,
    op: row.amt > 0 ? 1 : 0.4,
    pill: row.amt > 0 ? ACC : "#dcd3c4",
    pillFg: row.amt > 0 ? "#f5ead8" : "#645c50",
  }));
  const taxLabel = "฿" + fmt(r.tax);
  const effLabel = (netN > 0 ? (r.tax / netN) * 100 : 0).toFixed(1) + "%";
  const topRate = (BR[r.top].rate * 100).toFixed(0) + "%";

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
        พื้นฐาน · อ่าน 6 นาที
      </span>
      <h1 style={{ margin: "18px 0 20px", fontSize: 52, lineHeight: 1.1, color: "#201e1d" }}>
        ภาษีขั้นบันไดคืออะไร
      </h1>
      <p style={{ margin: "0 0 26px", font: "400 20px/1.7 var(--font-body)", color: "#474238" }}>
        คำถามที่คนถามเยอะที่สุดคือ &quot;เงินเดือนขึ้นแล้วจะเสียภาษี 15% ของทั้งก้อนเลยเหรอ&quot;
        คำตอบคือไม่ และนี่คือเหตุผล
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 30px" }} />

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        เงินของคุณไม่ได้ถูกคิดเป็นก้อนเดียว
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        ลองคิดว่าเงินได้ของคุณเป็นน้ำที่เทลงถังที่วางเรียงกันเป็นชั้น ๆ ถังใบล่างสุดจุได้ ฿150,000
        และไม่เก็บภาษีเลย เมื่อล้นถังใบนั้น น้ำส่วนที่เกินจะไหลลงถังใบต่อไปที่คิด 5% ล้นอีกก็ไหลลงใบที่คิด
        10% ต่อไปเรื่อย ๆ
      </p>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        เพราะฉะนั้น การ &quot;อยู่ขั้น 15%&quot; ไม่ได้แปลว่าเงินทั้งหมดถูกคิด 15% —
        มันหมายถึงเงินก้อนสุดท้ายของคุณอยู่ในถังใบที่คิด 15% เท่านั้น
        ก้อนก่อนหน้ายังคิดในอัตราเดิมของมัน
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
          <h3 style={{ margin: 0, fontSize: 22, color: "#201e1d" }}>ลองเลื่อนดูของตัวเอง</h3>
          <p style={{ margin: 0, font: "400 14px/1.6 var(--font-body)", color: "#474238" }}>
            ใส่เงินได้สุทธิ (รายได้ทั้งปี หลังหักค่าใช้จ่ายและค่าลดหย่อนแล้ว)
          </p>
          <input
            value={net}
            onChange={(e) => setNet(e.target.value)}
            inputMode="numeric"
            placeholder="450000"
            style={{
              maxWidth: 230,
              padding: "13px 20px",
              borderRadius: 999,
              border: "1px solid #c0b6a5",
              background: "#f9f4ed",
              font: "600 16px/1 var(--font-number)",
              color: "#201e1d",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {brackets.map((b) => (
            <div key={b.key} style={{ opacity: b.op, display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  minWidth: 44,
                  font: "600 12px/1 var(--font-number)",
                  padding: "5px 9px",
                  borderRadius: 999,
                  background: b.pill,
                  color: b.pillFg,
                  textAlign: "center",
                }}
              >
                {b.rate}
              </span>
              <span style={{ minWidth: 132, font: "400 12px/1 var(--font-number)", color: "#645c50" }}>
                {b.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 9,
                  borderRadius: 999,
                  background: "#dcd3c4",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background: b.barBg,
                    transition: "width .3s ease",
                    width: b.fill,
                  }}
                />
              </div>
              <span
                style={{
                  minWidth: 78,
                  textAlign: "right",
                  font: "600 13px/1 var(--font-number)",
                  color: "#201e1d",
                }}
              >
                {b.taxLabel}
              </span>
            </div>
          ))}
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
              ภาษีที่ต้องเสีย
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#8c491a" }}>
              {taxLabel}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
              อัตราจริงที่คุณจ่าย
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#201e1d" }}>
              {effLabel}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
              ขั้นสูงสุดที่คุณแตะ
            </span>
            <span style={{ font: "600 26px/1 var(--font-number)", color: "#56633f" }}>
              {topRate}
            </span>
          </div>
        </div>
        <p style={{ margin: 0, font: "400 14px/1.65 var(--font-body)", color: "#474238" }}>
          เห็นความต่างระหว่างสองตัวเลขขวาไหม — นั่นคือประเด็นทั้งหมดของบทความนี้
        </p>
      </div>

      <h2 style={{ margin: "0 0 14px", fontSize: 30, lineHeight: 1.2, color: "#201e1d" }}>
        แล้วเงินเดือนขึ้นควรกลัวไหม
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        ไม่ควร เพราะภาษีที่เพิ่มขึ้นคิดจากเฉพาะส่วนที่เพิ่ม ไม่ใช่ทั้งก้อน สมมติเงินได้สุทธิคุณอยู่ที่
        ฿480,000 แล้วได้ขึ้นอีก ฿40,000 ส่วนที่เพิ่มนั้นอยู่ในขั้น 10% เป็นส่วนใหญ่
        แปลว่าคุณยังเหลือเงินเพิ่มในกระเป๋าราว ฿36,000 อยู่ดี
      </p>
      <p
        style={{
          margin: "0 0 26px",
          font: "400 17px/1.8 var(--font-body)",
          color: "#474238",
          textWrap: "pretty",
        }}
      >
        คนที่รู้สึกว่า &quot;ขึ้นเงินเดือนแล้วเงินไม่ต่างเลย&quot; มักไม่ได้เจอปัญหาภาษี
        แต่เจอปัญหาที่รายจ่ายโตตามรายได้ — ซึ่งเป็นอีกเรื่องที่แอปเราจับให้เห็น
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
            เงินก้อนแรก ฿150,000 ของเงินได้สุทธิ ไม่เสียภาษีเลย เสมอ ไม่ว่าคุณจะได้เยอะแค่ไหน
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
            ไม่ต้องกดเครื่องคิดเลขเองทุกปี
          </span>
          <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
            ใส่เงินเดือนครั้งเดียว แอปคิดให้ตลอดปี
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
