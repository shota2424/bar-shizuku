"use client"

import { useState, useTransition, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createInventory, updateInventoryQuantity } from "./actions"

interface Item {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  alertThreshold: number
  note: string
}

export function InventoryView({ items }: { items: Item[] }) {
  const [orderMode, setOrderMode] = useState<'simple' | 'category'>('simple')
  const [showModal, setShowModal] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  // Optmistic UI state to feel instantly responsive on mobile
  const [optimisticItems, setOptimisticItems] = useState(items)

  // Sync when props change
  useMemo(() => {
    setOptimisticItems(items)
  }, [items])

  const handleUpdate = (id: string, newQty: number) => {
    const qty = Math.max(0, newQty)
    setOptimisticItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item))
    startTransition(async () => {
      await updateInventoryQuantity(id, qty)
    })
  }

  const categories = useMemo(() => {
    const cats: Record<string, Item[]> = {}
    optimisticItems.forEach(s => {
      const c = s.category || 'その他'
      if (!cats[c]) cats[c] = []
      cats[c].push(s)
    })
    return cats
  }, [optimisticItems])

  const orderList = useMemo(() => {
    return optimisticItems
      .filter(s => s.alertThreshold - s.quantity > 0)
      .map(s => ({ ...s, order_qty: s.alertThreshold - s.quantity }))
  }, [optimisticItems])

  const generateMessage = () => {
    if (orderList.length === 0) return "本日の発注はありません"

    let msg = "お疲れ様です。BAR 雫です。\n以下の発注をお願いいたします。\n\n"
    
    if (orderMode === 'simple') {
      orderList.forEach(s => {
        msg += `・${s.name}：${s.order_qty}${s.unit}\n`
      })
    } else {
      const cats: Record<string, typeof orderList> = {}
      orderList.forEach(s => {
        const c = s.category || 'その他'
        if (!cats[c]) cats[c] = []
        cats[c].push(s)
      })
      Object.keys(cats).forEach(c => {
        msg += `【${c}】\n`
        cats[c].forEach(s => {
          msg += `・${s.name}：${s.order_qty}${s.unit}\n`
        })
        msg += "\n"
      })
    }
    msg += "\nよろしくお願いいたします。"
    return msg
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMessage()).then(() => {
      setToastMsg('コピーしました')
      setTimeout(() => setToastMsg(''), 2000)
    })
  }

  const openLine = () => {
    window.location.href = `line://msg/text/${encodeURIComponent(generateMessage())}`
  }

  return (
    <div className="pb-24 max-w-md mx-auto">
      <div className="space-y-6">
        {Object.keys(categories).map(cat => (
          <section key={cat} className="space-y-3">
            <h2 className="text-lg font-semibold text-indigo-500 border-l-4 border-indigo-500 pl-2">
              {cat}
            </h2>
            <div className="grid gap-3">
              {categories[cat].map(item => {
                const orderNeeded = Math.max(0, item.alertThreshold - item.quantity)
                return (
                  <div key={item.id} className="bg-card border rounded-xl p-4 flex justify-between items-center shadow-sm">
                    <div className="flex-1 pr-2">
                      <h3 className="font-bold text-[15px] leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">目安: {item.alertThreshold}</span>
                        {orderNeeded > 0 ? (
                          <Badge variant="destructive" className="px-2 py-0 text-[10px] h-5 bg-amber-500 hover:bg-amber-600">
                            要発注: {orderNeeded}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="px-2 py-0 text-[10px] h-5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                            充足
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-background rounded-lg border shadow-inner">
                      <button 
                        className="flex items-center justify-center w-11 h-11 bg-card hover:bg-accent active:bg-accent/80 text-xl text-muted-foreground transition-colors rounded-l-lg touch-manipulation"
                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      >−</button>
                      <input 
                        type="number" 
                        className="w-12 h-11 bg-transparent text-center font-bold text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val)) handleUpdate(item.id, val)
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                      <button 
                        className="flex items-center justify-center w-11 h-11 bg-card hover:bg-accent active:bg-accent/80 text-xl text-muted-foreground transition-colors rounded-r-lg touch-manipulation"
                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      >＋</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t z-10 md:hidden">
        <Button 
          onClick={() => setShowModal(true)}
          className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg text-base"
        >
          LINE 発注メッセージを作成
        </Button>
      </div>
      
      {/* Desktop Floating Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-10">
        <Button 
          onClick={() => setShowModal(true)}
          className="h-14 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full shadow-lg text-base"
        >
          LINE 発注メッセージを作成
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-5 border top-[50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>発注メッセージ生成</DialogTitle>
          </DialogHeader>
          
          <div className="flex bg-muted rounded-lg p-1 mb-2">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${orderMode === 'simple' ? 'bg-background shadow' : 'text-muted-foreground'}`}
              onClick={() => setOrderMode('simple')}
            >シンプル</button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${orderMode === 'category' ? 'bg-background shadow' : 'text-muted-foreground'}`}
              onClick={() => setOrderMode('category')}
            >カテゴリ別</button>
          </div>

          <div className="bg-muted p-4 rounded-xl border text-sm whitespace-pre-wrap h-[40vh] overflow-y-auto font-mono mb-2 leading-relaxed">
            {generateMessage()}
          </div>

          <div className="flex gap-3 mt-2">
            <Button 
              variant="outline"
              className="flex-1 h-12 font-bold rounded-xl"
              onClick={copyToClipboard}
            >
              コピー
            </Button>
            <Button 
              className="flex-1 h-12 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl"
              onClick={openLine}
            >
              LINE起動
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      <div className={`fixed top-16 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-5 py-3 rounded-full shadow-lg text-sm font-bold z-50 transition-all duration-300 transform ${toastMsg ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
        {toastMsg}
      </div>
    </div>
  )
}
