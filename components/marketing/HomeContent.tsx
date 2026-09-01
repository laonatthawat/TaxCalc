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
  const preTaxDed = expDed + 60000;
  const netInc = Math.max(0, annual - preTaxDed);
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
      num: "−฿" + fmt(preTaxDed),
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

  const heroEff = (annual > 0 ? (heroTax / annual) * 100 : 0).toFixed(1) + "%";

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
      {/* hero */}
      <section
        style={{
          padding: "clamp(44px,6vw,84px) clamp(20px,4vw,44px) clamp(40px,5vw,64px)",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 18px",
              font: "600 12px/1 var(--font-body)",
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
              fontSize: "clamp(38px,6vw,74px)",
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
              maxWidth: "52ch",
              fontSize: "clamp(16px,1.4vw,19px)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "#474238",
              textWrap: "pretty",
            }}
          >
            เราไม่ได้มาสอนให้คุณเป็นนักบัญชี แค่อยากให้คุณเห็นว่าเงินก้อนที่หามาทั้งเดือนถูกแบ่งไปเป็นภาษี
            เป็นค่าเช่า เป็นค่ากินอยู่เท่าไร แล้วเหลือเป็นของคุณจริง ๆ กี่บาท
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/login?mode=signup"
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
        </div>
      </section>

      {/* narrative */}
      <section
        style={{
          padding: "clamp(40px,5vw,56px) 0 clamp(48px,6vw,72px)",
          background: "#ebddc5",
          borderTop: "1px solid #dcd3c4",
          borderBottom: "1px solid #dcd3c4",
        }}
      >
        <div
          style={{
            padding: "0 clamp(20px,4vw,44px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px,4vw,44px)",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 520px", display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,36px)", minWidth: 0 }}>
            <div style={{ maxWidth: "60ch", display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(27px,3.4vw,38px)", lineHeight: 1.15, color: "#201e1d" }}>
                เรื่องของเล็ก เงินเดือน ฿20,000
              </h2>
              <p style={{ margin: 0, fontSize: "clamp(15px,1.3vw,17px)", fontWeight: 400, lineHeight: 1.7, color: "#474238" }}>
                เล็กเพิ่งเรียนจบมาทำงานแรกได้ไม่กี่เดือน ยื่นภาษีไม่เป็นเลย ปีนี้เลยลองไล่ดูทีละขั้นว่าเงินของตัวเองหายไปตรงไหน
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {story.map((s) => (
                <div
                  key={s.no}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: "clamp(14px,2vw,26px)",
                    alignItems: "start",
                    padding: "clamp(20px,2.4vw,26px) 0",
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
                  <div style={{ display: "flex", gap: "clamp(14px,2vw,26px)", flexWrap: "wrap", alignItems: "flex-start", minWidth: 0 }}>
                    <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: "clamp(20px,2vw,24px)", lineHeight: 1.25, color: "#201e1d" }}>
                        {s.title}
                      </h3>
                      <p style={{ margin: 0, maxWidth: "56ch", font: "400 15px/1.7 var(--font-body)", color: "#474238", textWrap: "pretty" }}>
                        {s.body}
                      </p>
                    </div>
                    <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 3, textAlign: "right", minWidth: 120 }}>
                      <span style={{ font: "600 clamp(24px,2.6vw,30px)/1.1 var(--font-number)", color: s.numFg }}>
                        {s.num}
                      </span>
                      <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>{s.numLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "sticky",
              top: 86,
              background: "#f5ead8",
              border: "1px solid #dcd3c4",
              borderRadius: 28,
              padding: "clamp(22px,3vw,30px)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: "1 1 320px",
              minWidth: 0,
              maxWidth: 380,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <h3 style={{ margin: 0, fontSize: "clamp(20px,2vw,24px)", lineHeight: 1.2, color: "#201e1d" }}>
                แล้วของคุณล่ะ
              </h3>
              <p style={{ margin: 0, font: "400 15px/1.6 var(--font-body)", color: "#474238" }}>
                ใส่เงินเดือนดูเลย ไม่ต้องสมัคร ไม่ต้องกรอกอะไรอีก
              </p>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                inputMode="numeric"
                placeholder="20000"
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 999,
                  border: "1px solid #c0b6a5",
                  background: "#f9f4ed",
                  font: "600 17px/1 var(--font-number)",
                  color: "#201e1d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", height: 32, borderRadius: 999, overflow: "hidden", background: "#dcd3c4" }}>
              {prop.map((p) => (
                <div key={p.label} style={{ width: `${p.w}%`, background: p.bg, transition: "width .3s ease" }} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {prop.map((p) => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 11, height: 11, flexShrink: 0, borderRadius: 999, background: p.bg }} />
                  <span style={{ flex: 1, font: "500 14px/1 var(--font-body)", color: "#474238" }}>{p.label}</span>
                  <span style={{ font: "600 15px/1 var(--font-number)", color: "#201e1d" }}>{p.value}</span>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: 14, borderTop: "1px solid #dcd3c4", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ font: "400 13px/1.4 var(--font-body)", color: "#645c50" }}>อัตราจริงที่คุณจ่าย</span>
                <span style={{ font: "600 20px/1 var(--font-number)", color: "#8c491a" }}>{heroEff}</span>
              </div>
              <Link
                href="/login?mode=signup"
                style={{
                  textAlign: "center",
                  padding: 13,
                  borderRadius: 999,
                  background: "#c67139",
                  font: "600 14px/1 var(--font-body)",
                  color: "#f5ead8",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                คิดละเอียดในแอป
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* audience split */}
      <section style={{ padding: "clamp(48px,6vw,72px) clamp(20px,4vw,44px) 0" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "clamp(27px,3.4vw,38px)", lineHeight: 1.15, color: "#201e1d" }}>
          คุณมาแบบไหน
        </h2>
        <p style={{ margin: "0 0 28px", maxWidth: "52ch", fontSize: "clamp(15px,1.3vw,17px)", fontWeight: 400, lineHeight: 1.7, color: "#474238" }}>
          เลือกข้อที่ใกล้ตัวคุณ เราจะพาไปคนละทาง
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {audiences.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAudience(a.key)}
              style={{
                textAlign: "left",
                padding: "clamp(24px,3vw,32px)",
                borderRadius: 28,
                border: `1px solid ${audience === a.key ? "#c67139" : "#dcd3c4"}`,
                background: audience === a.key ? "#ffe1d0" : "#f9f4ed",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Icon name={a.icon} style={{ width: 26, height: 26, color: "#8c491a" }} />
              <span style={{ fontSize: "clamp(19px,2vw,23px)", fontWeight: 600, lineHeight: 1.25, color: "#201e1d" }}>
                {a.title}
              </span>
              <span style={{ font: "400 15px/1.65 var(--font-body)", color: "#474238" }}>{a.body}</span>
              <span style={{ marginTop: 6, font: "600 14px/1 var(--font-body)", color: "#8c491a" }}>{a.cta} →</span>
            </button>
          ))}
        </div>
        {audience && (
          <div
            style={{
              marginTop: 20,
              background: "#e1eecc",
              borderRadius: 28,
              padding: "clamp(22px,3vw,30px)",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  font: "600 12px/1 var(--font-body)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#56633f",
                }}
              >
                ทางของคุณ
              </span>
              <p style={{ margin: 0, font: "400 16px/1.7 var(--font-body)", color: "#272e1b" }}>{audienceNote}</p>
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
                textDecoration: "none",
              }}
            >
              {audienceBtn}
            </Link>
          </div>
        )}
      </section>

      {/* articles teaser */}
      <section style={{ padding: "clamp(44px,5vw,64px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(27px,3.4vw,38px)", lineHeight: 1.15, color: "#201e1d" }}>
            อ่านก่อนก็ได้
          </h2>
          <Link href="/articles" style={{ font: "600 15px/1 var(--font-body)", color: "#8c491a", cursor: "pointer" }}>
            ดูคลังบทความทั้งหมด →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16 }}>
          {teaser.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.id}`}
              style={{
                textAlign: "left",
                padding: 24,
                borderRadius: 28,
                border: "1px solid #dcd3c4",
                background: "#f9f4ed",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
                textDecoration: "none",
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
              <span style={{ font: "600 19px/1.35 var(--font-body)", color: "#201e1d" }}>{a.title}</span>
              <span style={{ font: "400 14px/1.6 var(--font-body)", color: "#645c50" }}>{a.blurb}</span>
              <span style={{ marginTop: "auto", paddingTop: 10, font: "500 12px/1 var(--font-body)", color: "#82796a" }}>
                อ่าน {a.mins} นาที
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
