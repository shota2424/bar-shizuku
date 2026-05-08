"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function upsertAttendance(data: {
  staffId: string
  date: string
  clockIn?: string
  clockOut?: string
  drinkBack?: number
  nominationFee?: number
  bonus?: number
  note?: string
}) {
  await db.attendance.upsert({
    where: {
      staffId_date: {
        staffId: data.staffId,
        date: new Date(data.date),
      },
    },
    create: {
      staffId: data.staffId,
      date: new Date(data.date),
      clockIn: data.clockIn,
      clockOut: data.clockOut,
      drinkBack: data.drinkBack ?? 0,
      nominationFee: data.nominationFee ?? 0,
      bonus: data.bonus ?? 0,
      note: data.note ?? "",
    },
    update: {
      clockIn: data.clockIn,
      clockOut: data.clockOut,
      drinkBack: data.drinkBack ?? 0,
      nominationFee: data.nominationFee ?? 0,
      bonus: data.bonus ?? 0,
      note: data.note ?? "",
    },
  })
  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/salary")
}
