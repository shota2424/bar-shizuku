"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Clock, Edit } from "lucide-react"
import { upsertAttendance } from "./actions"

interface Staff { id: string; name: string }
interface Attendance {
  id: string
  staffId: string
  clockIn: string | null
  clockOut: string | null
  drinkBack: number
  nominationFee: number
  bonus: number
  note: string
}

interface AttendanceViewProps {
  staff: Staff[]
  attendanceMap: Record<string, Attendance>
  date: string
}

function calcHours(clockIn: string | null, clockOut: string | null): string {
  if (!clockIn || !clockOut) return "—"
  const [sh, sm] = clockIn.split(":").map(Number)
  const [eh, em] = clockOut.split(":").map(Number)
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins < 0) mins += 24 * 60
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}時間${m > 0 ? m + "分" : ""}`
}

export function AttendanceView({ staff, attendanceMap, date }: AttendanceViewProps) {
  const [editTarget, setEditTarget] = useState<Staff | null>(null)
  const [clockIn, setClockIn] = useState("")
  const [clockOut, setClockOut] = useState("")
  const [drinkBack, setDrinkBack] = useState("0")
  const [nominationFee, setNominationFee] = useState("0")
  const [bonus, setBonus] = useState("0")
  const [note, setNote] = useState("")
  const [isPending, startTransition] = useTransition()

  function openEdit(s: Staff) {
    const a = attendanceMap[s.id]
    setClockIn(a?.clockIn ?? "")
    setClockOut(a?.clockOut ?? "")
    setDrinkBack(String(a?.drinkBack ?? 0))
    setNominationFee(String(a?.nominationFee ?? 0))
    setBonus(String(a?.bonus ?? 0))
    setNote(a?.note ?? "")
    setEditTarget(s)
  }

  function handleSave() {
    if (!editTarget) return
    startTransition(async () => {
      await upsertAttendance({
        staffId: editTarget.id,
        date,
        clockIn: clockIn || undefined,
        clockOut: clockOut || undefined,
        drinkBack: Number(drinkBack),
        nominationFee: Number(nominationFee),
        bonus: Number(bonus),
        note,
      })
      setEditTarget(null)
    })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => {
          const a = attendanceMap[s.id]
          return (
            <Card key={s.id} className="relative">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">{s.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => openEdit(s)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {a?.clockIn ?? "--:--"} 〜 {a?.clockOut ?? "--:--"}
                  </span>
                  <span className="ml-auto font-mono text-xs">
                    {calcHours(a?.clockIn ?? null, a?.clockOut ?? null)}
                  </span>
                </div>
                {a && (
                  <div className="flex gap-3 text-xs text-muted-foreground pt-1">
                    <span>DB ¥{a.drinkBack.toLocaleString()}</span>
                    <span>指名 ¥{a.nominationFee.toLocaleString()}</span>
                    <span>賞与 ¥{a.bonus.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!editTarget} onOpenChange={(v) => !v && setEditTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget?.name} の出勤記録</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>出勤</Label>
                <Input type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>退勤</Label>
                <Input type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">ドリンクバック</Label>
                <Input type="number" value={drinkBack} onChange={(e) => setDrinkBack(e.target.value)} min={0} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">指名料</Label>
                <Input type="number" value={nominationFee} onChange={(e) => setNominationFee(e.target.value)} min={0} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ボーナス</Label>
                <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} min={0} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>メモ</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="備考" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isPending}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
