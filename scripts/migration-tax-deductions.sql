-- ตาราง tax_deductions ยังไม่เคยถูกสร้างในฐานข้อมูลนี้เลย (ต่างจาก incomes ที่มีอยู่แล้ว)
-- สร้างใหม่ทั้งตาราง โดยรวมฟิลด์ใหม่ (easy_e_receipt, pension_insurance) เข้าไปตั้งแต่แรกเลย

create table if not exists tax_deductions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  has_spouse boolean not null default false,
  children_count integer not null default 0,
  children_count_esg integer not null default 0,
  parents_count integer not null default 0,
  disabled_dependents_count integer not null default 0,
  social_security_paid numeric not null default 0,
  life_insurance_premium numeric not null default 0,
  health_insurance_premium numeric not null default 0,
  parent_health_insurance_premium numeric not null default 0,
  pvd_contribution numeric not null default 0,
  rmf_amount numeric not null default 0,
  pension_insurance numeric not null default 0,
  thai_esg_amount numeric not null default 0,
  mortgage_interest numeric not null default 0,
  easy_e_receipt numeric not null default 0,
  donation_general numeric not null default 0,
  donation_education_sports numeric not null default 0,
  updated_at timestamptz not null default now()
);

-- เผื่อไว้กรณีตารางมีอยู่แล้วแต่ยังไม่มีคอลัมน์ใหม่ (ไม่มีผลถ้าเพิ่ง create ใหม่จากด้านบน)
alter table tax_deductions add column if not exists easy_e_receipt numeric not null default 0;
alter table tax_deductions add column if not exists pension_insurance numeric not null default 0;

alter table incomes add column if not exists income_sub text;

-- เปิด Row Level Security แล้วให้แต่ละคนอ่าน/เขียนได้เฉพาะแถวของตัวเอง
alter table tax_deductions enable row level security;

drop policy if exists "select own tax_deductions" on tax_deductions;
create policy "select own tax_deductions" on tax_deductions
  for select using (auth.uid() = user_id);

drop policy if exists "insert own tax_deductions" on tax_deductions;
create policy "insert own tax_deductions" on tax_deductions
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own tax_deductions" on tax_deductions;
create policy "update own tax_deductions" on tax_deductions
  for update using (auth.uid() = user_id);

drop policy if exists "delete own tax_deductions" on tax_deductions;
create policy "delete own tax_deductions" on tax_deductions
  for delete using (auth.uid() = user_id);
