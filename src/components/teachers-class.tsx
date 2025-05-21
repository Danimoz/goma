/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Class } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Card, CardContent } from "./ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import AddStudentsToClass from "./add-students-to-class";
import NewSubject from "./new-subject";
import { TStudentWithResults } from "@/types/interfaces";
import BulkResults from "./bulk-results";

interface TeacherClassProps {
  teacherEmail?: string;
  class: Class
}
export default function TeachersClass({ teacherEmail, class: singleClass }: TeacherClassProps) {
  const { data: classStudents, error: classStudentsError, isLoading: classStudentsLoading, mutate } = useSWR<TStudentWithResults[]>(`/api/users/students/${singleClass.id}`, fetcher);
 
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex justify-end">
          <AddStudentsToClass
            class={singleClass}
            onStudentsUpdated={mutate}
          />
        </div>

        <div className="mt-4">
          {classStudentsLoading ? (
            <div className='p-4'>Loading...</div>
          ) : (
            <div>
              <h2 className="font-bold text-xl mb-3">Students {`(${classStudents?.length})`}</h2>
              <Table>
                <TableHeader>
                  <TableRow className='bg-congress-blue-100'>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student?.user?.firstName} {student?.user?.lastName}</TableCell>
                      <TableCell className='text-right'>
                        {/* Add any actions you want for each student here */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <NewSubject />
          <BulkResults 
            classStudents={classStudents} 
            updateClassStudent={mutate}
            classId={singleClass.id}
          />
        </div>
      </CardContent>
    </Card>
  )
}