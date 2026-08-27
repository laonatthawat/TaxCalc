# จ่ายจนเจ็บ 💸

แอปจัดการการเงินส่วนตัวครบวงจร — ติดตามรายจ่ายประจำ รายรับ และประมาณการภาษีเงินได้บุคคลธรรมดา ไว้ในที่เดียว จะได้เห็นภาพการเงินตัวเองชัดๆ ก่อนจะจ่ายจนเจ็บ

โปรเจกต์ส่วนตัวสำหรับฝึกฝนและเก็บพอร์ต (side project)

## ฟีเจอร์หลัก

**รายจ่ายประจำ** — บันทึกค่าเช่า ค่าน้ำค่าไฟ ค่าผ่อน subscription (Netflix, Spotify ฯลฯ) พร้อมแจ้งเตือนก่อนถึงกำหนดจ่าย และมิเตอร์ความเจ็บเทียบงบประมาณต่อเดือน

**รายรับ** — บันทึกเงินเดือน โบนัส งานฟรีแลนซ์ ทั้งแบบประจำ (recurring) และครั้งเดียว (one-time) รวมถึงเงินให้จากพ่อแม่/คู่สมรส (ยกเว้นภาษี) ดูกระแสเงินสดสุทธิได้ทันที

**ภาษี** — ประมาณการภาษีเงินได้บุคคลธรรมดาจากรายรับจริงในระบบ แยกคำนวณค่าใช้จ่ายตามเงินได้ 8 ประเภท (มาตรา 40) ค่าลดหย่อนครบทุกรายการหลัก และตารางอัตราภาษีแบบขั้นบันได

> ตัวเลขภาษี/ผลตอบแทนการลงทุนในแอปเป็นการประมาณการเท่านั้น ไม่ใช่คำแนะนำทางการเงิน/ภาษีอย่างเป็นทางการ

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, TypeScript, `src` directory)
- **Styling**: Tailwind CSS + custom CSS (`app/globals.css`)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL + Auth, email/password)
- **Charts**: [Recharts](https://recharts.org)
- **Icons**: [lucide-react](https://lucide.dev)
- **Deploy**: [Vercel](https://vercel.com)

## เริ่มต้นใช้งาน (Local Development)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment variables

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์ แล้วใส่ค่าจาก Supabase project ของคุณ (Project Settings → API):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. รัน development server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## โครงสร้างฐานข้อมูล (Supabase)

ตารางหลักในฐานข้อมูล (ทุกตารางมี Row Level Security ป้องกันไม่ให้เห็นข้อมูลของผู้ใช้คนอื่น):

- `subscriptions` — รายการรายจ่ายประจำ
- `incomes` — รายการรายรับ (ประจำ/ครั้งเดียว/เงินให้)
- `user_settings` — งบประมาณต่อเดือน (สำหรับมิเตอร์ความเจ็บ)
- `investment_plans` — แผนการลงทุน (เงินต้น เงินลงทุนต่อเดือน อัตราผลตอบแทน ระยะเวลา)
- `tax_deductions` — ค่าลดหย่อนภาษีของแต่ละผู้ใช้

## Deploy

Deploy ผ่าน [Vercel](https://vercel.com) โดยเชื่อมต่อกับ GitHub repository นี้ อย่าลืมตั้งค่า environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ใน Vercel project settings ด้วย
