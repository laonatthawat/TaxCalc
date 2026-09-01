"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { FAQS, FAQ_CATS } from "@/lib/content";

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [faqCat, setFaqCat] = useState("ทั้งหมด");

  const filtered = FAQS.filter((f) => faqCat === "ทั้งหมด" || f.cat === faqCat);

  return (
    <div style={{ padding: "clamp(44px,6vw,72px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,64px)", alignItems: "flex-end", paddingBottom: "clamp(24px,3vw,36px)" }}>
        <div style={{ flex: "1 1 420px", minWidth: 0, maxWidth: 620 }}>
          <p
            style={{
              margin: "0 0 16px",
              font: "600 12px/1 var(--font-body)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#82796a",
            }}
          >
            คำถามที่พบบ่อย
          </p>
          <h1 style={{ margin: 0, maxWidth: "20ch", fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.08, color: "#201e1d" }}>
            ที่คนถามกันบ่อย
          </h1>
        </div>
        <p style={{ flex: "1 1 340px", minWidth: 0, maxWidth: 560, marginLeft: "auto", marginTop: 0, marginBottom: 0, textAlign: "right", fontSize: "clamp(15px,1.4vw,18px)", fontWeight: 400, lineHeight: 1.75, color: "#474238", textWrap: "pretty" }}>
          รวมคำถามที่เข้ามาจริงตั้งแต่เปิดเว็บ ตอบตรง ๆ ไม่มีคำว่า &quot;ขึ้นอยู่กับกรณี&quot; ถ้าไม่เจอที่อยากรู้ ส่งมาได้ตรง ๆ
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: "clamp(18px,2.4vw,24px) 0",
          borderTop: "1px solid #dcd3c4",
          borderBottom: "1px solid #dcd3c4",
          marginBottom: "clamp(20px,3vw,28px)",
        }}
      >
        {FAQ_CATS.map((c) => {
          const active = faqCat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFaqCat(c)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: `1px solid ${active ? "#c67139" : "#c0b6a5"}`,
                background: active ? "#ffe1d0" : "transparent",
                font: "500 14px/1 var(--font-body)",
                color: active ? "#8c491a" : "#645c50",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", font: "400 14px/1 var(--font-body)", color: "#82796a" }}>
          {filtered.length} คำถาม
        </span>
      </div>

      <div style={{ maxWidth: 860, display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((f) => {
          const i = FAQS.indexOf(f);
          const open = openFaq === i;
          return (
            <div
              key={f.q}
              style={{
                borderRadius: 28,
                border: `1px solid ${open ? "#c0b6a5" : "#dcd3c4"}`,
                background: open ? "#f9f4ed" : "transparent",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(open ? -1 : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "20px clamp(20px,2.4vw,26px)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <span style={{ flex: 1, minWidth: 0, fontSize: "clamp(16px,1.6vw,18px)", fontWeight: 600, lineHeight: 1.4, color: "#201e1d" }}>
                  {f.q}
                </span>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: "#ebddc5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={open ? "minus" : "plus"} style={{ width: 17, height: 17, color: "#8c491a" }} />
                </span>
              </button>
              {open && (
                <p
                  style={{
                    margin: 0,
                    padding: `0 clamp(20px,2.4vw,26px) 22px`,
                    maxWidth: "58ch",
                    font: "400 15px/1.75 var(--font-body)",
                    color: "#474238",
                    textWrap: "pretty",
                  }}
                >
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "clamp(32px,4vw,44px)",
          background: "#ebddc5",
          borderRadius: 28,
          padding: "clamp(24px,3vw,32px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "48ch" }}>
          <span style={{ fontSize: "clamp(18px,1.8vw,21px)", fontWeight: 600, lineHeight: 1.35, color: "#201e1d" }}>
            ยังไม่เจอคำตอบ
          </span>
          <span style={{ font: "400 15px/1.65 var(--font-body)", color: "#474238" }}>
            ลองดูจุดอื่นของเว็บ หรือกลับมาถามใหม่ทีหลังได้
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/articles"
            style={{ padding: "12px 20px", borderRadius: 999, background: "#ffe1d0", font: "600 14px/1 var(--font-body)", color: "#8c491a", cursor: "pointer", textDecoration: "none" }}
          >
            ดูคลังบทความ
          </Link>
          <Link
            href="/features"
            style={{ padding: "12px 20px", borderRadius: 999, background: "#ffe1d0", font: "600 14px/1 var(--font-body)", color: "#8c491a", cursor: "pointer", textDecoration: "none" }}
          >
            แอปนี้ทำอะไรได้
          </Link>
          <Link
            href="/login?mode=signup"
            style={{ padding: "12px 20px", borderRadius: 999, background: "#c67139", font: "600 14px/1 var(--font-body)", color: "#f5ead8", cursor: "pointer", textDecoration: "none" }}
          >
            เริ่มใช้ฟรี
          </Link>
        </div>
      </div>
    </div>
  );
}
