'use client'

type Props = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

// กล่องยืนยันแบบมีธีมของแอปเอง (ใช้ class .modal-overlay/.modal-card เดียวกับ modal ฟอร์มอื่นๆ)
// แทนที่ window.confirm() ของ browser เดิม — เหตุผล: (1) หน้าตา native popup ไม่เข้าธีมแอปเลย
// ต่างจากทุกจุดอื่นที่คุมดีไซน์เองหมด (2) ใส่ชื่อรายการที่กำลังจะลบในข้อความได้ ชัดเจนกว่า
// "ยืนยันลบรายการนี้?" เฉยๆ ลดโอกาสกดลบผิดรายการ
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'ลบรายการ',
  cancelLabel = 'ยกเลิก',
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ width: 340 }} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title" style={{ fontSize: 17, marginBottom: 10 }}>
          {title}
        </h2>
        <p style={{ fontSize: 13, color: '#47474f', margin: '0 0 22px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} className="btn-secondary" style={{ flex: 1 }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-secondary-danger" style={{ flex: 1 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
