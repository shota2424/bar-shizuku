"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Lock } from "lucide-react"
import { createStaff, deleteStaff, createDrink } from "./actions"

export function SettingsView({ initialStaffs }: { initialStaffs: any[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState("")
  
  const [staffName, setStaffName] = useState("")
  const [drinkName, setDrinkName] = useState("")
  const [drinkCategory, setDrinkCategory] = useState("")
  const [drinkAlert, setDrinkAlert] = useState("3")
  
  const [isPending, startTransition] = useTransition()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === "1234") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("パスコードが間違っています")
      setPasscode("")
    }
  }

  const handleAddStaff = () => {
    if (!staffName) return
    startTransition(async () => {
      await createStaff({ name: staffName, role: "STAFF" })
      setStaffName("")
    })
  }

  const handleDeleteStaff = (id: string) => {
    if (!confirm("本当に削除しますか？")) return
    startTransition(async () => {
      await deleteStaff(id)
    })
  }

  const handleAddDrink = () => {
    if (!drinkName) return
    startTransition(async () => {
      await createDrink({
        name: drinkName,
        category: drinkCategory || "その他",
        alertThreshold: parseInt(drinkAlert) || 0
      })
      setDrinkName("")
      setDrinkCategory("")
      setDrinkAlert("3")
      alert("ドリンクを追加しました！")
    })
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-sm mx-auto mt-12">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>パスコード入力</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="4桁の数字 (例: 1234)" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="text-center tracking-widest text-lg"
                maxLength={4}
                autoFocus
              />
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </div>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
              ロック解除
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">スタッフ管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="スタッフ名" 
              value={staffName} 
              onChange={(e) => setStaffName(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleAddStaff} disabled={isPending || !staffName} className="shrink-0 bg-indigo-500 hover:bg-indigo-600">
              <Plus className="w-4 h-4 mr-1" /> 追加
            </Button>
          </div>
          <div className="space-y-2 mt-4">
            {initialStaffs.map(staff => (
              <div key={staff.id} className="flex justify-between items-center p-3 border rounded-lg bg-card shadow-sm">
                <span className="font-medium">{staff.name}</span>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleDeleteStaff(staff.id)} disabled={isPending}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {initialStaffs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">スタッフが登録されていません</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ドリンク追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ドリンク名</Label>
            <Input 
              placeholder="例: 山崎 NV" 
              value={drinkName} 
              onChange={(e) => setDrinkName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>カテゴリ</Label>
              <Input 
                placeholder="ウイスキー" 
                value={drinkCategory} 
                onChange={(e) => setDrinkCategory(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>発注アラート閾値</Label>
              <Input 
                type="number" 
                value={drinkAlert} 
                onChange={(e) => setDrinkAlert(e.target.value)}
                disabled={isPending}
                min={0}
              />
            </div>
          </div>
          <Button onClick={handleAddDrink} disabled={isPending || !drinkName} className="w-full bg-indigo-500 hover:bg-indigo-600">
            <Plus className="w-4 h-4 mr-1" /> 在庫アイテムとして追加
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
