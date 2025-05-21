'use client';

import { getOrCreateAcademicYear }from "@/actions/academic-year";
import { useEffect, useState } from "react";

export default function useAcademicYear() {
  const [academicYearId, setAcademicYearId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAcademicYear(){
      const storedAcademicYear = sessionStorage.getItem('academicYear')
      if (storedAcademicYear){
        setAcademicYearId(storedAcademicYear)
      } else {
        const academicYear = await getOrCreateAcademicYear()
        sessionStorage.setItem('academicYear', academicYear?.id ?? '')
        setAcademicYearId(academicYear?.id ?? null)
      }
    }
    fetchAcademicYear()
  }, [])

  return { academicYearId }
}