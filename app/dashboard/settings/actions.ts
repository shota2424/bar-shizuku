"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { StaffRole } from "@prisma/client"

export async function getStaffs() {
  return await db.staff.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function createStaff(data: { name: string, role: StaffRole }) {
  await db.staff.create({ data })
  revalidatePath("/dashboard/settings")
}

export async function deleteStaff(id: string) {
  await db.staff.delete({ where: { id } })
  revalidatePath("/dashboard/settings")
}

export async function createDrink(data: {
  name: string
  category: string
  alertThreshold: number
}) {
  await db.inventory.create({
    data: {
      name: data.name,
      category: data.category,
      alertThreshold: data.alertThreshold,
      quantity: 0,
      unit: "本"
    }
  })
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/inventory")
}
