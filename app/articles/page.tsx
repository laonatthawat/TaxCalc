"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ACC, ACC_D } from "@/lib/tax";
import { ARTICLES, FAQS } from "@/lib/content";

const TAGS = ["ทั้งหมด", "พื้นฐาน", "ลดหย่อน", "โบนัส", "ฟรีแลนซ์"];
const FAQ_PEEK = [FAQS[0].q, FAQS[1].q, FAQS[5].q];

export default function ArticlesPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("ทั้งหมด");

  const qLower = q.trim().toLowerCase();
  const filtered = ARTICLES.filter((a) => {
    const okTag = tag === "ทั้งหมด" || a.tag === tag;
    const okQ = !qLower || `${a.title} ${a.blurb} ${a.kw}`.toLowerCase().includes(qLower);
    return okTag && okQ;
  });
  const noResults = filtered.length === 0;
  const resultLabel = noResults ? "ไม่พบบทความ" : `เจอ ${filtered.length} บทความ`;

  return (
    <div style={{ padding: "clamp(44px,6vw,72px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
      <p
        style={{
          margin: "0 0 16px",
          font: "600 12px/1 var(--font-body)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#82796a",
        }}
      >
        คลังบทความ
      </p>
      <h1 style={{ margin: "0 0 18px", maxWidth: "20ch", fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.08, color: "#201e1d" }}>
        สงสัยอะไร ค้นตรงนี้
      </h1>
      <p style={{ margin: "0 0 28px", maxWidth: "54ch", fontSize: "clamp(16px,1.4vw,18px)", fontWeight: 400, lineHeight: 1.7, color: "#474238" }}>
        เขียนแบบพูดกับเพื่อน ไม่มีศัพท์ที่ไม่อธิบาย ทุกบทความมีตัวเลขจริงให้ดู
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,32px)", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Icon
                name="search"
                style={{ width: 18, height: 18, color: "#82796a", position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="พิมพ์เรื่องที่สงสัย เช่น โบนัส ลดหย่อน"
                style={{
                  width: "100%",
                  padding: "15px 20px 15px 50px",
                  borderRadius: 999,
                  border: "1px solid #c0b6a5",
                  background: "#f9f4ed",
                  font: "400 15px/1 var(--font-body)",
                  color: "#201e1d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {TAGS.map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: `1px solid ${active ? ACC : "#c0b6a5"}`,
                    background: active ? "#ffe1d0" : "transparent",
                    font: "500 14px/1 var(--font-body)",
                    color: active ? ACC_D : "#645c50",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <p style={{ margin: "0 0 20px", font: "400 14px/1 var(--font-body)", color: "#82796a" }}>{resultLabel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.id}`}
                style={{
                  textAlign: "left",
                  padding: "clamp(22px,2.6vw,30px)",
                  borderRadius: 28,
                  border: "1px solid #dcd3c4",
                  background: "#f9f4ed",
                  cursor: "pointer",
                  display: "flex",
                  gap: 22,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  textDecoration: "none",
                }}
              >
                <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
                  <span
                    style={{
                      padding: "5px 11px",
                      borderRadius: 999,
                      background: "#ffe1d0",
                      font: "600 11px/1.4 var(--font-body)",
                      color: "#8c491a",
                      alignSelf: "flex-start",
                    }}
                  >
                    {a.tag}
                  </span>
                  <span style={{ fontSize: "clamp(18px,1.8vw,22px)", fontWeight: 600, lineHeight: 1.3, color: "#201e1d" }}>
                    {a.title}
                  </span>
                  <span style={{ maxWidth: "62ch", font: "400 15px/1.65 var(--font-body)", color: "#474238" }}>
                    {a.blurb}
                  </span>
                </div>
                <span style={{ flexShrink: 0, font: "500 13px/1 var(--font-body)", color: "#82796a" }}>
                  {a.mins} นาที
                </span>
              </Link>
            ))}
          </div>
          {noResults && (
            <div
              style={{
                padding: 44,
                borderRadius: 28,
                background: "#ebddc5",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Icon name="search-x" style={{ width: 26, height: 26, color: "#82796a" }} />
              <p style={{ margin: 0, font: "500 16px/1.6 var(--font-body)", color: "#474238" }}>
                ยังไม่มีบทความเรื่องนี้ — บอกเราได้ว่าอยากอ่านอะไร
              </p>
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 86, display: "flex", flexDirection: "column", gap: 16, flex: "1 1 320px", minWidth: 0, maxWidth: 380 }}>
          <div style={{ padding: "clamp(22px,3vw,30px)", borderRadius: 28, background: "#ebddc5", display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ font: "600 12px/1 var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", color: "#82796a" }}>
              เริ่มที่นี่ถ้ายังใหม่
            </span>
            <h3 style={{ margin: 0, fontSize: 21, lineHeight: 1.3, color: "#201e1d" }}>ภาษีขั้นบันไดคืออะไร</h3>
            <p style={{ margin: 0, font: "400 14px/1.65 var(--font-body)", color: "#474238" }}>
              หกนาทีจบ อ่านจบแล้วจะเข้าใจว่าทำไมเงินเดือนขึ้นไม่ได้แปลว่าเสียภาษีเพิ่มทั้งก้อน
            </p>
            <Link
              href="/articles/ladder"
              style={{ alignSelf: "flex-start", padding: "12px 22px", borderRadius: 999, background: "#c67139", font: "600 14px/1 var(--font-body)", color: "#f5ead8", cursor: "pointer", textDecoration: "none" }}
            >
              อ่านเลย
            </Link>
          </div>
          <div style={{ padding: "clamp(22px,3vw,30px)", borderRadius: 28, background: "#f9f4ed", border: "1px solid #dcd3c4", display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ font: "600 12px/1 var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", color: "#82796a" }}>
              คนถามกันมากสุด
            </span>
            {FAQ_PEEK.map((q) => (
              <Link
                key={q}
                href="/faq"
                style={{ textAlign: "left", font: "500 15px/1.55 var(--font-body)", color: "#474238", cursor: "pointer", textDecoration: "none" }}
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
