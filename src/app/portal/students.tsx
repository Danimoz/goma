'use client';

import StudentResults from "@/components/students-results";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useAcademicYear from "@/hooks/use-academic-year";
import { fetcher } from "@/lib/utils";
import { TStudentTermResults } from "@/types/interfaces";
import { AcademicSession } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function StudentsPortal() {
  const { academicYearId } = useAcademicYear();
  const [selectedAcademicSession, setSelectedAcademicSession] = useState(academicYearId)
  const { data: academicSessions } = useSWR<AcademicSession[]>('/api/class/session', fetcher)
  const { data: results, error: resultError, isLoading: resultLoading } = useSWR<TStudentTermResults>(`/api/class/results?academicSessionId=${selectedAcademicSession}`, fetcher)

  useEffect(() => {
    if (academicYearId) setSelectedAcademicSession(academicYearId)
  }, [academicYearId])

  if (resultLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-2">Loading results...</h1>
      </div>
    )
  }

  if (resultError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-2">Error loading results</h1>
        <p>{resultError.message}</p>
      </div>
    )
  }
  
  return (
    <section className="md:container md:mx-auto mx-3 py-12 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">Student Results</h1>
        <div className="flex flex-col items-end justify-end mb-4">
          <h5 className="text-sm text-muted-foreground font-semibold">Academic session</h5>
          <Select value={selectedAcademicSession as string} onValueChange={(value) => setSelectedAcademicSession(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Academic Session" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {academicSessions?.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="FIRST">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value='FIRST'>First Term</TabsTrigger>
          <TabsTrigger value='SECOND'>Second Term</TabsTrigger>
          <TabsTrigger value='THIRD'>Third Term</TabsTrigger>
        </TabsList>
        {(['FIRST', 'SECOND', 'THIRD'] as const).map((term) => (
          <TabsContent key={term} value={term}>
            <StudentResults term={term} results={results} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}