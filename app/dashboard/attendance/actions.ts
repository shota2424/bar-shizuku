"use server"

import { revalidatePath } from "next/cache"

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
  // DB has been removed for attendance, so this is just a mock for now
  await new Promise(resolve => setTimeout(resolve, 500))
  revalidatePath("/dashboard/attendance")
}
