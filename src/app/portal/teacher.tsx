/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import useAcademicYear from "@/hooks/use-academic-year";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Class } from "@prisma/client";
import AssignTeacherClasses from "@/components/assign-teacher-classes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import TeachersClass from "@/components/teachers-class";

export default function TeacherPortal() {
  const { data: session } = useSession();
  const { academicYearId } = useAcademicYear();
  const { data: teacherClasses, error: teacherClassError, isLoading: teachersClassLoading } = useSWR<Class[]>(
    academicYearId && session?.user.email
      ? `/api/class?academicSessionId=${academicYearId}&teacherId=${session?.user.email}`
      : null,
    fetcher
  );
  const { data: defaultClasses, error: classesError, isLoading: classesLoadin } = useSWR<Class[]>(
    !teacherClasses || teacherClasses.length === 0
      ? `/api/class?academicSessionId=${academicYearId}`
      : null,
    fetcher
  );
  const { data: teacher, error: teacherError, isLoading: teacherLoading } = useSWR(
    (!teacherClasses || teacherClasses.length === 0) && session?.user.email // Fetch if no classes assigned and user email exists
      ? `/api/users/teachers/${session?.user.email}`
      : null,
    fetcher
  );
  const [activeClass, setActiveClass] = useState<string | null>(null);

  useEffect(() => {
    if (teacherClasses && teacherClasses.length > 0) {
      // If activeClass is not set, or if the current activeClass is not in the new list of teacherClasses
      if (!activeClass || !teacherClasses.some(c => c.id === activeClass)) {
        setActiveClass(teacherClasses[0].id);
      }
    } else if (teacherClasses && teacherClasses.length === 0) {
      // If there are no teacher classes, activeClass should be null
      setActiveClass(null);
    }
  }, [teacherClasses, activeClass]); // Added activeClass to dependencies

  return (
    <div>
      {/* State 1: Loading teacher's assigned classes */}
      {teachersClassLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-2">Loading assigned classes...</h1>
        </div>
      ) : /* State 2: Assigned classes loaded, but there are none */
        (teacherClasses && teacherClasses.length === 0) ? (
          teacherLoading ? ( /* Still loading teacher details to allow assignment */
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-2xl font-bold mb-2">Loading teacher details...</h1>
            </div>
          ) : teacher ? ( /* Teacher details loaded, show assignment option */
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-2xl font-bold mb-2">No classes assigned</h1>
              <AssignTeacherClasses teacher={teacher} />
            </div>
          ) : ( /* Teacher details failed or not found */
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-2xl font-bold mb-2">Could not load teacher details.</h1>
              <p>Unable to proceed with class assignment.</p>
            </div>
          )
        ) : /* State 3: Assigned classes loaded, and there are some, and activeClass is set */
          (teacherClasses && teacherClasses.length > 0 && activeClass) ? (
            <section className="container mx-auto py-10">
              {/* Make Tabs fully controlled */}
              <Tabs value={activeClass} onValueChange={setActiveClass}>
                <TabsList>
                  {teacherClasses.map((singleClass) => (
                    <TabsTrigger value={singleClass.id} key={singleClass.id}>{singleClass.name}</TabsTrigger>
                  ))}
                </TabsList>
                {teacherClasses.map((singleClass) => (
                  <TabsContent value={singleClass.id} key={singleClass.id}>
                    <TeachersClass teacherEmail={session?.user.email as string} class={singleClass} />
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          ) : /* Fallback: Covers brief moments where teacherClasses might be undefined (but not loading) 
             or if teacherClasses has items but activeClass isn't set by useEffect yet.
             A minimal loading or empty state could also be rendered here if this state is noticeable. */
            null
      }
    </div>
  );
}