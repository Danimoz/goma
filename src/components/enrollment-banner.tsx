'use client'

import { useEffect, useState } from "react";
import { getCurrentAcademicSession, isEnrollmentPeriod } from "@/lib/utils";

export default function EnrollmentBanner() {
  const [session, setSession] = useState<string | null>(null);
  const [isEnrollment, setIsEnrollment] = useState<boolean>(false);
  
  useEffect(() => {
    setSession(getCurrentAcademicSession());
    setIsEnrollment(isEnrollmentPeriod());
  }, [])

  return (
    <div className="inline-flex items-center rounded-full border border-congress-blue-500/20 bg-white px-3 py-1 text-sm text-congress-blue-500 shadow-md">
      <span className="mr-2 h-2 w-2 rounded-full bg-congress-blue-500" />
      {isEnrollment ? `Admissions Open for ${session}` : `Current Session ${session}`}
    </div>
  )
}