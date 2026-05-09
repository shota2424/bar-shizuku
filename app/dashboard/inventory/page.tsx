import { InventoryView } from "./inventory-view"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  let items = await db.inventory.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  })

  // 動作確認用のダミーデータ投入 (Phase 1 要件)
  if (items.length === 0) {
    await db.inventory.createMany({
      data: [
        // ウイスキー
        { name: 'ハイボール用ウイスキー', category: 'ウイスキー', alertThreshold: 3, quantity: 0, unit: '本' },
        { name: '山崎', category: 'ウイスキー', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: '白州', category: 'ウイスキー', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: '響', category: 'ウイスキー', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'モンキーショルダー', category: 'ウイスキー', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'イチローズモルト', category: 'ウイスキー', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'マッカラン 12年', category: 'ウイスキー', alertThreshold: 1, quantity: 0, unit: '本' },
        // テキーラ
        { name: 'サウザシルバー', category: 'テキーラ', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'クエルボゴールド', category: 'テキーラ', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: '1800レポサド', category: 'テキーラ', alertThreshold: 2, quantity: 0, unit: '本' },
        // リキュール
        { name: 'クライナー', category: 'リキュール', alertThreshold: 2, quantity: 0, unit: '箱' },
        { name: 'コカレロ', category: 'リキュール', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'ミスティア', category: 'リキュール', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'アマレット', category: 'リキュール', alertThreshold: 1, quantity: 0, unit: '本' },
        { name: 'カシス', category: 'リキュール', alertThreshold: 2, quantity: 0, unit: '本' },
        // 焼酎・その他
        { name: 'キンミヤ', category: '焼酎', alertThreshold: 3, quantity: 0, unit: '本' },
        { name: 'いいちこ (麦)', category: '焼酎', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: '黒伊佐錦 (芋)', category: '焼酎', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: '吉四六 (麦)', category: '焼酎', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'ハブ酒', category: 'その他', alertThreshold: 1, quantity: 0, unit: '本' },
        // シャンパン
        { name: 'モエ・ブリュット', category: 'シャンパン', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'モエ・アンペリアル', category: 'シャンパン', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'モエ・ロゼ', category: 'シャンパン', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'モエ・アイス', category: 'シャンパン', alertThreshold: 2, quantity: 0, unit: '本' },
        { name: 'ドン・ペリニヨン', category: 'シャンパン', alertThreshold: 1, quantity: 0, unit: '本' },
        { name: 'ベルエポック', category: 'シャンパン', alertThreshold: 1, quantity: 0, unit: '本' },
        { name: 'アルマンド', category: 'シャンパン', alertThreshold: 1, quantity: 0, unit: '本' },
        // 割材
        { name: 'ウーロン茶', category: '割材', alertThreshold: 3, quantity: 0, unit: 'ケース' },
        { name: '緑茶', category: '割材', alertThreshold: 3, quantity: 0, unit: 'ケース' },
        { name: '紅茶', category: '割材', alertThreshold: 2, quantity: 0, unit: 'ケース' },
        { name: 'ジャスミン茶', category: '割材', alertThreshold: 2, quantity: 0, unit: 'ケース' },
      ]
    })
    
    items = await db.inventory.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">在庫管理</h1>
        <p className="text-muted-foreground text-sm">ボトル・ドリンクの在庫管理</p>
      </div>
      <InventoryView items={items} />
    </div>
  )
}
