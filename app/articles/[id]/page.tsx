import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, ARTICLE_BODY } from "@/lib/content";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  const body = ARTICLE_BODY[id];
  if (!article || !body) notFound();

  const related = ARTICLES.filter((a) => a.id !== id).slice(0, 3);

  return (
    <div style={{ maxWidth: 760, padding: "clamp(32px,4vw,48px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)" }}>
      <Link
        href="/articles"
        style={{ display: "inline-block", marginBottom: 26, font: "500 14px/1 var(--font-body)", color: "#8c491a", cursor: "pointer" }}
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
        {article.tag} · อ่าน {article.mins} นาที
      </span>
      <h1 style={{ margin: "18px 0 18px", fontSize: "clamp(30px,4.4vw,52px)", lineHeight: 1.1, color: "#201e1d" }}>
        {article.title}
      </h1>
      <p style={{ margin: "0 0 26px", fontSize: "clamp(17px,1.6vw,20px)", fontWeight: 400, lineHeight: 1.7, color: "#474238", textWrap: "pretty" }}>
        {body.lead}
      </p>
      <div style={{ height: 1, background: "#dcd3c4", margin: "0 0 28px" }} />

      {body.blocks.map((b, i) => {
        if (b.t === "h2") {
          return (
            <h2 key={i} style={{ margin: "0 0 14px", fontSize: "clamp(24px,2.6vw,30px)", lineHeight: 1.2, color: "#201e1d" }}>
              {b.text}
            </h2>
          );
        }
        if (b.t === "p") {
          return (
            <p key={i} style={{ margin: "0 0 22px", fontSize: "clamp(16px,1.5vw,17px)", fontWeight: 400, lineHeight: 1.8, color: "#474238", textWrap: "pretty" }}>
              {b.text}
            </p>
          );
        }
        if (b.t === "rows") {
          return (
            <div key={i} style={{ margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ font: "600 16px/1.5 var(--font-body)", color: "#201e1d" }}>{b.text}</span>
              {b.rows.map((r) => (
                <p
                  key={r.label}
                  style={{ margin: 0, paddingLeft: 18, borderLeft: "2px solid #dcd3c4", font: "400 16px/1.8 var(--font-body)", color: "#474238", textWrap: "pretty" }}
                >
                  <strong style={{ fontWeight: 600, color: "#201e1d" }}>
                    {r.label} — {r.value}
                  </strong>{" "}
                  {r.note}
                </p>
              ))}
            </div>
          );
        }
        // note
        return (
          <p
            key={i}
            style={{
              margin: "0 0 26px",
              paddingTop: 22,
              borderTop: "1px solid #dcd3c4",
              fontSize: "clamp(17px,1.6vw,19px)",
              fontWeight: 600,
              lineHeight: 1.7,
              color: "#201e1d",
              textWrap: "pretty",
            }}
          >
            {b.text}
          </p>
        );
      })}

      <div style={{ marginTop: "clamp(30px,4vw,44px)", paddingTop: 26, borderTop: "1px solid #dcd3c4", display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ font: "600 12px/1 var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", color: "#82796a" }}>
          อ่านต่อ
        </span>
        {related.map((r) => (
          <Link
            key={r.id}
            href={`/articles/${r.id}`}
            style={{ textAlign: "left", font: "500 16px/1.6 var(--font-body)", color: "#474238", cursor: "pointer", textDecoration: "none" }}
          >
            {r.title} →
          </Link>
        ))}
      </div>
    </div>
  );
}
