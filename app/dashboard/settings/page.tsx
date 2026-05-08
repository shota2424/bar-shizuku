import { SettingsView } from "./settings-view"
import { getStaffs } from "./actions"

export default async function SettingsPage() {
  const staffs = await getStaffs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">運営設定</h1>
        <p className="text-muted-foreground text-sm">パスコードで保護された管理エリア</p>
      </div>
      <SettingsView initialStaffs={staffs} />
    </div>
  )
}
