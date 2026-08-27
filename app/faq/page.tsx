"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { FAQS } from "@/lib/content";

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState(0);

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
        คำถามที่พบบ่อย
      </p>
      <h1 style={{ margin: "0 0 34px", maxWidth: "22ch", fontSize: 56, lineHeight: 1.08, color: "#201e1d" }}>
        ที่คนถามกันบ่อย
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((f, i) => {
          const open = openFaq === i;
          return (
            <div
              key={f.q}
              style={{
                borderRadius: 28,
                border: "1px solid #dcd3c4",
                background: open ? "#f9f4ed" : "transparent",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(open ? -1 : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "24px 28px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                <span style={{ flex: 1, font: "600 18px/1.4 var(--font-body)", color: "#201e1d" }}>
                  {f.q}
                </span>
                <Icon
                  name={open ? "minus" : "plus"}
                  style={{ width: 20, height: 20, color: "#8c491a", flexShrink: 0 }}
                />
              </button>
              {open && (
                <p
                  style={{
                    margin: 0,
                    padding: "0 28px 26px",
                    maxWidth: "64ch",
                    font: "400 16px/1.75 var(--font-body)",
                    color: "#474238",
                  }}
                >
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
