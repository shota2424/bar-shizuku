import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Package, Wallet } from "lucide-react"

const mockLowInventory = [
  { id: "1", name: "ジャックダニエル", quantity: 1, unit: "本" },
  { id: "2", name: "炭酸水", quantity: 3, unit: "ケース" },
]

export default function DashboardPage() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground text-sm">{dateStr}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">


        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              今月売上
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,280,000</div>
            <p className="text-xs text-muted-foreground">
              {today.getMonth() + 1}月累計
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              在庫アラート
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLowInventory.length}件</div>
            <p className="text-xs text-muted-foreground">要発注アイテム</p>
          </CardContent>
        </Card>


      </div>

      <div className="grid gap-4 md:grid-cols-2">


        <Card>
          <CardHeader>
            <CardTitle className="text-base">在庫アラート</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockLowInventory.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <Badge variant="destructive">
                    残{item.quantity}{item.unit}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
