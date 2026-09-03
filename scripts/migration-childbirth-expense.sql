-- ค่าฝากครรภ์และคลอดบุตร (ลดหย่อนได้ตามที่จ่ายจริง ไม่เกิน 60,000 บาทต่อการตั้งครรภ์หนึ่งครั้ง) — คอลัมน์ใหม่
alter table tax_deductions add column if not exists childbirth_expense numeric not null default 0;
