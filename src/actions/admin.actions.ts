"use server"

import { revalidatePath } from "next/cache"

import { regenerateReviewSummary } from "@/services/ai-summary.service"
import {
  updateBookingStatus,
  updateContactStatus,
  updateEventInquiryStatus,
  updateReviewStatus,
} from "@/services/admin.service"
import type { BookingStatus, ContactStatus, EventStatus, ReviewStatus } from "@/types/database"

export async function updateBookingStatusAction(id: string, status: BookingStatus) {
  await updateBookingStatus(id, status)
  revalidatePath("/admin/reservations")
}

export async function updateEventInquiryStatusAction(id: string, status: EventStatus) {
  await updateEventInquiryStatus(id, status)
  revalidatePath("/admin/private-events")
}

export async function updateReviewStatusAction(id: string, status: ReviewStatus) {
  await updateReviewStatus(id, status)
  revalidatePath("/admin/reviews")
  revalidatePath("/reviews")
}

export async function updateContactStatusAction(id: string, status: ContactStatus) {
  await updateContactStatus(id, status)
  revalidatePath("/admin/contact")
}

export interface RegenerateSummaryResult {
  success: boolean
  error?: string
}

export async function regenerateReviewSummaryAction(): Promise<RegenerateSummaryResult> {
  try {
    await regenerateReviewSummary()
    revalidatePath("/admin/reviews")
    revalidatePath("/reviews")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    }
  }
}
