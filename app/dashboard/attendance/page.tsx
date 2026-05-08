import { AttendanceView } from "./attendance-view"

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)

const mockStaff = [
  { id: "1", name: "山田 花子" },
  { id: "2", name: "鈴木 さくら" },
  { id: "3", name: "田中 美咲" },
  { id: "4", name: "伊藤 ゆき" },
  { id: "5", name: "渡辺 あい" },
]

const mockAttendanceMap: Record<string, {
  id: string
  staffId: string
  clockIn: string | null
  clockOut: string | null
  drinkBack: number
  nominationFee: number
  bonus: number
  note: string
}> = {
  "1": { id: "a1", staffId: "1", clockIn: "18:00", clockOut: null, drinkBack: 3000, nominationFee: 5000, bonus: 0, note: "" },
  "2": { id: "a2", staffId: "2", clockIn: "19:00", clockOut: null, drinkBack: 1500, nominationFee: 0, bonus: 0, note: "" },
  "3": { id: "a3", staffId: "3", clockIn: "18:30", clockOut: "23:00", drinkBack: 2000, nominationFee: 3000, bonus: 1000, note: "早上がり" },
}

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">出勤管理</h1>
        <p className="text-muted-foreground text-sm">本日 {todayStr} の出勤記録</p>
      </div>
      <AttendanceView staff={mockStaff} attendanceMap={mockAttendanceMap} date={todayStr} />
    </div>
  )
}
