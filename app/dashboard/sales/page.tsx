import { SalesView } from "./sales-view"

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1

const mockSales = [
  { id: "v1", date: `${year}-${String(month).padStart(2,"0")}-01`, cash: 85000, card: 45000, receivable: 20000, total: 150000, guestCount: 12, note: "" },
  { id: "v2", date: `${year}-${String(month).padStart(2,"0")}-02`, cash: 120000, card: 30000, receivable: 0, total: 150000, guestCount: 18, note: "満席" },
  { id: "v3", date: `${year}-${String(month).padStart(2,"0")}-03`, cash: 60000, card: 20000, receivable: 10000, total: 90000, guestCount: 8, note: "" },
  { id: "v4", date: `${year}-${String(month).padStart(2,"0")}-04`, cash: 95000, card: 55000, receivable: 0, total: 150000, guestCount: 15, note: "" },
  { id: "v5", date: `${year}-${String(month).padStart(2,"0")}-05`, cash: 70000, card: 40000, receivable: 30000, total: 140000, guestCount: 11, note: "売掛あり" },
]

const monthTotal = mockSales.reduce((sum, s) => sum + s.total, 0)
const monthGuests = mockSales.reduce((sum, s) => sum + s.guestCount, 0)

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">売上管理</h1>
        <p className="text-muted-foreground text-sm">{year}年{month}月</p>
      </div>
      <SalesView
        sales={mockSales}
        monthTotal={monthTotal}
        monthGuests={monthGuests}
        year={year}
        month={month}
      />
    </div>
  )
}
