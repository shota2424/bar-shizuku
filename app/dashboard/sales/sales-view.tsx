"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"
import { upsertSale } from "./actions"

interface Sale {
  id: string
  date: string
  cash: number
  card: number
  receivable: number
  total: number
  guestCount: number
  note: string
}

interface SalesViewProps {
  sales: Sale[]
  monthTotal: number
  monthGuests: number
  year: number
  month: number
}

export function SalesView({ sales, monthTotal, monthGuests, year, month }: SalesViewProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editSale, setEditSale] = useState<Sale | null>(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [cash, setCash] = useState("0")
  const [card, setCard] = useState("0")
  const [receivable, setReceivable] = useState("0")
  const [guestCount, setGuestCount] = useState("0")
  const [note, setNote] = useState("")
  const [isPending, startTransition] = useTransition()

  function openForm(sale?: Sale) {
    if (sale) {
      setDate(sale.date)
      setCash(String(sale.cash))
      setCard(String(sale.card))
      setReceivable(String(sale.receivable))
      setGuestCount(String(sale.guestCount))
      setNote(sale.note)
      setEditSale(sale)
    } else {
      setDate(new Date().toISOString().slice(0, 10))
      setCash("0"); setCard("0"); setReceivable("0"); setGuestCount("0"); setNote("")
      setEditSale(null)
    }
    setFormOpen(true)
  }

  function handleSave() {
    startTransition(async () => {
      await upsertSale({
        date,
        cash: Number(cash),
        card: Number(card),
        receivable: Number(receivable),
        guestCount: Number(guestCount),
        note,
      })
      setFormOpen(false)
    })
  }

  const preview = Number(cash) + Number(card) + Number(receivable)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">今月売上合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{monthTotal.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">今月来客数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthGuests}人</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">客単価</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthGuests > 0 ? `¥${Math.round(monthTotal / monthGuests).toLocaleString()}` : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-1" />
          売上入力
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead className="text-right">現金</TableHead>
              <TableHead className="text-right hidden sm:table-cell">カード</TableHead>
              <TableHead className="text-right hidden sm:table-cell">売掛</TableHead>
              <TableHead className="text-right font-bold">合計</TableHead>
              <TableHead className="text-right hidden sm:table-cell">来客</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  売上データがありません
                </TableCell>
              </TableRow>
            )}
            {sales.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.date}</TableCell>
                <TableCell className="text-right font-mono text-sm">¥{s.cash.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-sm hidden sm:table-cell">¥{s.card.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-sm hidden sm:table-cell">¥{s.receivable.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-bold">¥{s.total.toLocaleString()}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">{s.guestCount}人</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openForm(s)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={(v) => !v && setFormOpen(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>売上入力</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>日付</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">現金</Label>
                <Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} min={0} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">カード</Label>
                <Input type="number" value={card} onChange={(e) => setCard(e.target.value)} min={0} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">売掛</Label>
                <Input type="number" value={receivable} onChange={(e) => setReceivable(e.target.value)} min={0} />
              </div>
            </div>
            <div className="text-sm text-right text-muted-foreground">
              合計: <span className="font-bold text-foreground">¥{preview.toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">来客数</Label>
              <Input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} min={0} />
            </div>
            <div className="space-y-1">
              <Label>メモ</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="備考" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={isPending || !date}>
              {isPending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
