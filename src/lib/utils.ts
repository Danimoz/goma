import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Returns the current academic session in the format "YYYY-YYYY"
 * The academic year starts in June and ends in May of the following year
 * @returns {string} The current academic session or null if not in enrollment period
 */
export function getCurrentAcademicSession(): string | null {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // Months are zero-indexed

  if (currentMonth < 9) {
    return `${currentYear - 1}-${currentYear}`
  } else  {
    return `${currentYear}-${currentYear + 1}`
  } 
}

/**
 * Checks if the current date is within the enrollment period
 * @returns {boolean} True if currently in enrollment period
 */
export function isEnrollmentPeriod(): boolean {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // Months are zero-indexed
  return currentMonth >= 6
}

export const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())