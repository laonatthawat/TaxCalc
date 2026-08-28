"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { signOut } from "@/app/income/actions";

const MARKETING_NAV = [
  { label: "หน้าแรก", href: "/" },
  { label: "ฟีเจอร์", href: "/features" },
  { label: "คลังบทความ", href: "/articles" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "คำถามที่พบบ่อย", href: "/faq" },
];

const APP_NAV = [
  { label: "รายรับ", href: "/income" },
  { label: "ภาษี", href: "/tax" },
];

type Props = {
  userEmail: string | null;
};

export default function MarketingNav({ userEmail }: Props) {
  const pathname = usePathname();
  const isLoggedIn = !!userEmail;
  // login แล้ว: ต่อแท็บรายรับ/ภาษีท้ายลิงก์ marketing เดิม ไม่ใช่แทนที่ทั้งหมด
  const navItems = isLoggedIn ? [...MARKETING_NAV, ...APP_NAV] : MARKETING_NAV;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "14px 42px",
        background: "rgba(245,234,216,.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #dcd3c4",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "#c67139",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="sprout" style={{ width: 17, height: 17, color: "#f5ead8" }} />
        </span>
        <span style={{ font: "600 17px/1 var(--font-body)", color: "#201e1d" }}>
          จ่ายจนเจ็บ
        </span>
      </Link>

      <div style={{ flex: 1, display: "flex", gap: 4 }}>
        {navItems.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                background: active ? "#ebddc5" : "transparent",
                font: "500 14px/1 var(--font-body)",
                color: active ? "#201e1d" : "#645c50",
                cursor: "pointer",
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </div>

      {isLoggedIn ? (
        <>
          <span style={{ font: "400 13px/1 var(--font-body)", color: "#6b6355" }}>{userEmail}</span>
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #c0b6a5",
              background: "transparent",
              font: "500 13px/1 var(--font-body)",
              color: "#474238",
              cursor: "pointer",
            }}
          >
            ออกจากระบบ
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              font: "500 14px/1 var(--font-body)",
              color: "#474238",
              cursor: "pointer",
            }}
          >
            เข้าสู่ระบบ
          </Link>

          <Link
            href="/signup"
            style={{
              padding: "11px 22px",
              borderRadius: 999,
              background: "#c67139",
              font: "600 14px/1 var(--font-body)",
              color: "#f5ead8",
              cursor: "pointer",
            }}
          >
            เริ่มใช้เลย
          </Link>
        </>
      )}
    </nav>
  );
}
