"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createInventory(data: {
  name: string
  category: string
  quantity: number
  unit: string
  alertThreshold: number
}) {
  await db.inventory.create({ data })
  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
}

export async function updateInventoryQuantity(id: string, quantity: number) {
  await db.inventory.update({ where: { id }, data: { quantity } })
  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
}

export async function deleteInventory(id: string) {
  await db.inventory.delete({ where: { id } })
  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
}
