-- ขั้นที่ 4 ของหน้าภาษี (ใหม่) ให้กรอกภาษีหัก ณ ที่จ่ายทั้งปี เพื่อคำนวณว่าต้องขอคืนหรือจ่ายเพิ่มตอนยื่นจริง
alter table tax_deductions add column if not exists withholding_tax numeric not null default 0;
