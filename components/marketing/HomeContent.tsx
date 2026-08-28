"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ACC, ACC_D, SAGE, fmt, num, taxOf } from "@/lib/tax";
import { ARTICLES } from "@/lib/content";

export default function HomeContent() {
  const [salary, setSalary] = useState("20000");
  const [audience, setAudience] = useState<"new" | "pro" | null>(null);

  const sal = num(salary);
  const annual = sal * 12;
  const expDed = Math.min(annual * 0.5, 100000);
  // ไม่หักประกันสังคมอัตโนมัติ — บางคนเงินเดือนมาโดยไม่มีประกันสังคม (เช่น ไม่ใช่ลูกจ้าง ม.33)
  // ตัวเลขคำนวณเร็วนี้เลยโชว์แค่ค่าลดหย่อนที่ทุกคนได้แน่ๆ ไม่เดาเรื่องเฉพาะบุคคล
  const netInc = Math.max(0, annual - expDed - 60000);
  const heroTax = taxOf(netInc).tax;
  const afterTax = Math.max(0, annual - heroTax);

  const story = [
    {
      no: "1",
      title: "ตัวเลขในสลิปกับเงินที่เข้าบัญชีไม่เท่ากัน",
      body: "ทุกเดือนมีประกันสังคมกับภาษีหัก ณ ที่จ่ายออกไปก่อน เล็กไม่เคยดูว่าสองก้อนนี้รวมกันปีละเท่าไร",
      num: "฿" + fmt(annual),
      numLabel: "รายได้ทั้งปีก่อนหักอะไร",
      dot: ACC,
      numFg: "#201e1d",
    },
    {
      no: "2",
      title: "รัฐหักค่าใช้จ่ายให้ก่อนโดยไม่ต้องขอ",
      body: "กฎหมายถือว่าการทำงานมีต้นทุน จึงหักให้ 50% ของรายได้ (ไม่เกิน ฿100,000) บวกค่าลดหย่อนส่วนตัวอีก ฿60,000 อัตโนมัติ",
      num: "−฿" + fmt(expDed + 60000),
      numLabel: "หักให้ก่อนคิดภาษี",
      dot: SAGE,
      numFg: "#56633f",
    },
    {
      no: "3",
      title: "ที่เหลือนี่แหละที่ถูกคิดภาษี",
      body: "ตัวเลขนี้เรียกว่าเงินได้สุทธิ คนส่วนใหญ่ตกใจเพราะคิดว่าภาษีคิดจากยอดในข้อ 1",
      num: "฿" + fmt(netInc),
      numLabel: "เงินได้สุทธิ",
      dot: ACC,
      numFg: "#201e1d",
    },
    {
      no: "4",
      title: "แล้วภาษีก็คิดเป็นขั้น ไม่ใช่อัตราเดียว",
      body: "ก้อนแรก ฿150,000 เสีย 0% ส่วนที่เกินค่อยขยับขึ้นทีละขั้น เล็กเลยไม่ได้เสียภาษีในอัตราสูงสุดของตัวเองทั้งก้อน",
      num: "฿" + fmt(heroTax),
      numLabel: "ภาษีทั้งปี",
      dot: ACC_D,
      numFg: ACC_D,
    },
  ];

  const prop = [
    { label: "ภาษี", value: "฿" + fmt(heroTax), w: (heroTax / Math.max(1, annual)) * 100, bg: ACC },
    { label: "เงินหลังหักภาษี", value: "฿" + fmt(afterTax), w: (afterTax / Math.max(1, annual)) * 100, bg: SAGE },
  ];

  const audiences = [
    {
      key: "new" as const,
      icon: "briefcase",
      title: "พนักงานประจำ ยื่นภาษีเองไม่เป็น",
      body: "บริษัทหักให้ทุกเดือนแต่ไม่รู้ว่าหักถูกไหม และไม่รู้ว่าตอนยื่นต้องทำอะไร",
      cta: "เริ่มจากพื้นฐาน",
    },
    {
      key: "pro" as const,
      icon: "calculator",
      title: "รู้เรื่องภาษีแล้ว หาแค่ที่จดบัญชี",
      body: "ไม่ต้องมาสอน อยากได้ที่บันทึกรายรับรายจ่ายที่คิดภาษีให้ถูกและส่งออกข้อมูลได้",
      cta: "ข้ามไปดูฟีเจอร์",
    },
  ];

  const audienceNote =
    audience === "pro"
      ? "ถ้าอย่างนั้นข้ามคำอธิบายไปเลย — ดูว่าแอปบันทึกอะไรได้ ส่งออกไฟล์แบบไหน และคำนวณภาษีด้วยสูตรไหน"
      : "เราจะพาไปอ่านเรื่องภาษีขั้นบันไดก่อน หกนาทีจบ แล้วค่อยเริ่มกรอกตัวเลขของตัวเอง";
  const audienceBtn = audience === "pro" ? "ไปหน้าฟีเจอร์" : "อ่านบทความแรก";
  const audienceHref = audience === "pro" ? "/features" : "/articles/ladder";

  const teaser = ARTICLES;

  return (
    <div>
      <section style={{ padding: "88px 42px 64px", maxWidth: 1400 }}>
        <p
          style={{
            margin: "0 0 18px",
            font: "600 12px/1 var(--font-number)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#82796a",
          }}
        >
          สมุดบัญชีที่อธิบายภาษีให้ฟัง
        </p>
        <h1
          style={{
            margin: "0 0 22px",
            maxWidth: "15ch",
            fontSize: 74,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#201e1d",
            textWrap: "balance",
          }}
        >
          เงินเดือนออกทุกเดือน แล้วมันไปไหนหมด
        </h1>
        <p
          style={{
            margin: "0 0 32px",
            maxWidth: "56ch",
            font: "400 19px/1.65 var(--font-body)",
            color: "#474238",
            textWrap: "pretty",
          }}
        >
          เราไม่ได้มาสอนให้คุณเป็นนักบัญชี
          แค่อยากให้คุณเห็นว่าเงินก้อนที่หามาทั้งเดือนถูกแบ่งไปเป็นภาษี เป็นค่าเช่า
          เป็นค่ากินอยู่เท่าไร แล้วเหลือเป็นของคุณจริง ๆ กี่บาท
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href="/signup"
            style={{
              padding: "16px 32px",
              borderRadius: 999,
              background: "#c67139",
              font: "600 16px/1 var(--font-body)",
              color: "#f5ead8",
              cursor: "pointer",
            }}
          >
            คิดเงินเดือนของฉัน
          </Link>
          <Link
            href="/articles"
            style={{
              padding: "16px 30px",
              borderRadius: 999,
              border: "1px solid #c0b6a5",
              background: "transparent",
              font: "600 16px/1 var(--font-body)",
              color: "#474238",
              cursor: "pointer",
            }}
          >
            อ่านเรื่องภาษีก่อน
          </Link>
        </div>
      </section>

      {/* narrative */}
      <section
        style={{
          padding: "56px 42px 72px",
          background: "#ebddc5",
          borderTop: "1px solid #dcd3c4",
          borderBottom: "1px solid #dcd3c4",
        }}
      >
        <div style={{ maxWidth: 1400, display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ maxWidth: "60ch", display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.15, color: "#201e1d" }}>
              เรื่องของเล็ก เงินเดือน{" "}
              <span style={{ fontFamily: "var(--font-number)" }}>฿{fmt(sal)}</span>
            </h2>
            <p style={{ margin: 0, font: "400 17px/1.7 var(--font-body)", color: "#474238" }}>
              เล็กเพิ่งเรียนจบมาทำงานแรกได้ไม่กี่เดือน ยื่นภาษีไม่เป็นเลย
              ปีนี้เลยลองไล่ดูทีละขั้นว่าเงินของตัวเองหายไปตรงไหน
            </p>
          </div>

          {/* เดิมกล่อง "แล้วของคุณล่ะ" อยู่ล่างสุดแบบเต็มความกว้าง ดูโล่งด้านขวาของลิสต์ขั้นตอนด้านบน
              ย้ายมาเป็น sticky sidebar ขวา วิ่งคู่กับลิสต์แทน ให้ใช้พื้นที่แนวนอนเต็มขึ้น */}
          <div className="narrative-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {story.map((s) => (
                <div
                  key={s.no}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr 200px",
                    gap: 22,
                    alignItems: "start",
                    padding: "26px 0",
                    borderTop: "1px solid #dcd3c4",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      background: s.dot,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "600 16px/1 var(--font-number)",
                      color: "#f9f4ed",
                    }}
                  >
                    {s.no}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1.2, color: "#201e1d" }}>
                      {s.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        maxWidth: "58ch",
                        font: "400 15px/1.7 var(--font-body)",
                        color: "#474238",
                        textWrap: "pretty",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, textAlign: "right" }}>
                    <span style={{ font: "600 26px/1.1 var(--font-number)", color: s.numFg }}>
                      {s.num}
                    </span>
                    <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>
                      {s.numLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="narrative-sidebar"
              style={{
                position: "sticky",
                top: 90,
                background: "#f5ead8",
                border: "1px solid #dcd3c4",
                borderRadius: 28,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.2, color: "#201e1d" }}>
                  แล้วของคุณล่ะ
                </h3>
                <p style={{ margin: 0, font: "400 14px/1.6 var(--font-body)", color: "#474238" }}>
                  ใส่เงินเดือนดูเลย ไม่ต้องสมัคร ไม่ต้องกรอกอะไรอีก
                </p>
                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  inputMode="numeric"
                  placeholder="20000"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 20px",
                    borderRadius: 999,
                    border: "1px solid #c0b6a5",
                    background: "#f9f4ed",
                    font: "600 17px/1 var(--font-number)",
                    color: "#201e1d",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    height: 32,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "#dcd3c4",
                  }}
                >
                  {prop.map((p) => (
                    <div
                      key={p.label}
                      style={{ width: `${p.w}%`, background: p.bg, transition: "width .3s ease" }}
                    />
                  ))}
                </div>
                {prop.map((p) => (
                  <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{ width: 11, height: 11, borderRadius: 999, background: p.bg, flexShrink: 0 }}
                    />
                    <span style={{ flex: 1, font: "500 14px/1 var(--font-body)", color: "#474238" }}>
                      {p.label}
                    </span>
                    <span style={{ font: "600 15px/1 var(--font-number)", color: "#201e1d" }}>
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .narrative-grid { grid-template-columns: 1fr !important; }
            .narrative-sidebar { position: static !important; }
          }
        `}</style>
      </section>

      {/* audience split */}
      <section style={{ padding: "72px 42px", maxWidth: 1400 }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 38, lineHeight: 1.15, color: "#201e1d" }}>
          คุณมาแบบไหน
        </h2>
        <p
          style={{
            margin: "0 0 32px",
            maxWidth: "52ch",
            font: "400 17px/1.7 var(--font-body)",
            color: "#474238",
          }}
        >
          เลือกข้อที่ใกล้ตัวคุณ เราจะพาไปคนละทาง
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {audiences.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAudience(a.key)}
              style={{
                flex: "1 1 380px",
                textAlign: "left",
                padding: 32,
                borderRadius: 28,
                border: `1px solid ${audience === a.key ? ACC : "#dcd3c4"}`,
                background: audience === a.key ? "#ffe1d0" : "#f9f4ed",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Icon name={a.icon} style={{ width: 26, height: 26, color: "#8c491a" }} />
              <span style={{ font: "600 23px/1.25 var(--font-body)", color: "#201e1d" }}>
                {a.title}
              </span>
              <span style={{ font: "400 15px/1.65 var(--font-body)", color: "#474238" }}>
                {a.body}
              </span>
              <span style={{ marginTop: 6, font: "600 14px/1 var(--font-body)", color: "#8c491a" }}>
                {a.cta} →
              </span>
            </button>
          ))}
        </div>
        {audience && (
          <div
            style={{
              marginTop: 22,
              background: "#e1eecc",
              borderRadius: 28,
              padding: "28px 32px",
              display: "flex",
              gap: 26,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  font: "600 12px/1 var(--font-number)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#56633f",
                }}
              >
                ทางของคุณ
              </span>
              <p style={{ margin: 0, font: "400 16px/1.7 var(--font-body)", color: "#272e1b" }}>
                {audienceNote}
              </p>
            </div>
            <Link
              href={audienceHref}
              style={{
                padding: "14px 26px",
                borderRadius: 999,
                background: "#56633f",
                font: "600 15px/1 var(--font-body)",
                color: "#f0fae1",
                cursor: "pointer",
              }}
            >
              {audienceBtn}
            </Link>
          </div>
        )}
      </section>

      {/* articles teaser */}
      <section style={{ padding: "0 42px 80px", maxWidth: 1400 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 26,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.15, color: "#201e1d" }}>
            อ่านก่อนก็ได้
          </h2>
          <Link
            href="/articles"
            style={{ font: "600 15px/1 var(--font-body)", color: "#8c491a", cursor: "pointer" }}
          >
            ดูคลังบทความทั้งหมด →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {teaser.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.id}`}
              style={{
                textAlign: "left",
                padding: 26,
                borderRadius: 28,
                border: "1px solid #dcd3c4",
                background: "#f9f4ed",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
              }}
            >
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
              <span style={{ font: "600 19px/1.35 var(--font-body)", color: "#201e1d" }}>
                {a.title}
              </span>
              <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>
                {a.blurb}
              </span>
              <span
                style={{
                  marginTop: "auto",
                  paddingTop: 10,
                  font: "500 12px/1 var(--font-body)",
                  color: "#82796a",
                }}
              >
                อ่าน {a.mins} นาที
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
