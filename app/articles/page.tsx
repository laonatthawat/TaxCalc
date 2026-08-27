"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ACC, ACC_D } from "@/lib/tax";
import { ARTICLES } from "@/lib/content";

const TAGS = ["ทั้งหมด", "พื้นฐาน", "ลดหย่อน", "โบนัส", "ฟรีแลนซ์"];

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
    <div style={{ padding: "72px 42px 88px", maxWidth: 1000 }}>
      <p
        style={{
          margin: "0 0 16px",
          font: "600 12px/1 var(--font-number)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#82796a",
        }}
      >
        คลังบทความ
      </p>
      <h1 style={{ margin: "0 0 20px", maxWidth: "20ch", fontSize: 56, lineHeight: 1.08, color: "#201e1d" }}>
        สงสัยอะไร ค้นตรงนี้
      </h1>
      <p
        style={{
          margin: "0 0 30px",
          maxWidth: "54ch",
          font: "400 18px/1.7 var(--font-body)",
          color: "#474238",
        }}
      >
        เขียนแบบพูดกับเพื่อน ไม่มีศัพท์ที่ไม่อธิบาย ทุกบทความมีตัวเลขจริงให้ดู
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 320px" }}>
          <Icon
            name="search"
            style={{
              width: 18,
              height: 18,
              color: "#82796a",
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
            }}
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
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p style={{ margin: "0 0 22px", font: "400 14px/1 var(--font-body)", color: "#82796a" }}>
        {resultLabel}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((a) => (
          <Link
            key={a.id}
            href="/articles/ladder"
            style={{
              textAlign: "left",
              padding: "28px 32px",
              borderRadius: 28,
              border: "1px solid #dcd3c4",
              background: "#f9f4ed",
              cursor: "pointer",
              display: "flex",
              gap: 26,
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
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
              <span style={{ font: "600 22px/1.3 var(--font-body)", color: "#201e1d" }}>
                {a.title}
              </span>
              <span
                style={{ maxWidth: "62ch", font: "400 15px/1.65 var(--font-body)", color: "#474238" }}
              >
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
  );
}
