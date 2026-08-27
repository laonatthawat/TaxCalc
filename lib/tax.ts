// เครื่องคำนวณภาษีแบบง่าย (ขั้นบันไดล้วนๆ ไม่รวมค่าลดหย่อน) — ใช้เฉพาะหน้า marketing
// (หน้าแรก + บทความสาธิต) เพื่อโชว์ตัวอย่างคร่าวๆ ให้คนที่ยังไม่ได้สมัคร ส่วนเครื่องคำนวณจริงที่ใช้ในแอป
// (รวมค่าลดหย่อนทุกประเภทตามรายได้ที่บันทึกไว้จริง) อยู่ที่ lib/taxUtils.ts

export type Bracket = {
  lo: number;
  hi: number;
  rate: number;
  label: string;
};

export const BR: Bracket[] = [
  { lo: 0, hi: 150000, rate: 0, label: "0 – 150,000" },
  { lo: 150000, hi: 300000, rate: 0.05, label: "150,001 – 300,000" },
  { lo: 300000, hi: 500000, rate: 0.1, label: "300,001 – 500,000" },
  { lo: 500000, hi: 750000, rate: 0.15, label: "500,001 – 750,000" },
  { lo: 750000, hi: 1000000, rate: 0.2, label: "750,001 – 1,000,000" },
  { lo: 1000000, hi: 2000000, rate: 0.25, label: "1,000,001 – 2,000,000" },
];

export const ACC = "#c67139";
export const ACC_D = "#8c491a";
export const SAGE = "#7a8a5e";

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const num = (v: string | number) => {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return isFinite(n) ? n : 0;
};

export type BracketRow = {
  b: Bracket;
  amt: number;
  t: number;
  fill: number;
};

export type TaxResult = {
  tax: number;
  top: number;
  rows: BracketRow[];
};

export function taxOf(net: number): TaxResult {
  let tax = 0;
  let top = 0;
  const rows: BracketRow[] = BR.map((b, i) => {
    const span = b.hi - b.lo;
    const amt = Math.max(0, Math.min(net - b.lo, span));
    const t = amt * b.rate;
    tax += t;
    if (amt > 0) top = i;
    return { b, amt, t, fill: span > 0 ? Math.min(100, (amt / span) * 100) : 0 };
  });
  return { tax, top, rows };
}
