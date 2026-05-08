"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function upsertSale(data: {
  date: string
  cash: number
  card: number
  receivable: number
  guestCount: number
  note?: string
}) {
  const total = data.cash + data.card + data.receivable
  await db.sale.upsert({
    where: { date: new Date(data.date) },
    create: { ...data, date: new Date(data.date), total },
    update: { cash: data.cash, card: data.card, receivable: data.receivable, guestCount: data.guestCount, note: data.note, total },
  })
  revalidatePath("/dashboard/sales")
  revalidatePath("/dashboard")
}
