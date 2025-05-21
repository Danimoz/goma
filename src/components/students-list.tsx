/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { fetcher } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { useDebounce } from 'use-debounce';
import { Class, Student, User } from "@prisma/client";
import AssignStudentClass from "./assign-student-classes";
import { Button } from "./ui/Button";

export default function StudentsList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 1000);
  const { data: studentsData, error: studentsError, isLoading: studentsLoading, mutate } = useSWR(`/api/users/students?page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`, fetcher)

  return (
    <div className="mt-4">
      {studentsLoading ? <div className='p-4'>Loading...</div> : (
        <div>
          <div className="flex justify-end relative">
            <Input
              type="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-1/4 pr-6 border rounded"
            />
            <Search className="absolute top-1/3 -translate-y-1/2 right-2 text-gray-500" />
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-congress-blue-100'>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData?.students?.map((student: Student & { user: Pick<User, "firstName" | "lastName" | "email"> } & { class: Pick<Class, "name"> }) => (
                <TableRow key={student.id}>
                  <TableCell>{student?.user?.firstName} {student?.user?.lastName}</TableCell>
                  <TableCell>{student?.user?.email}</TableCell>
                  <TableCell>{student.class.name}</TableCell>
                  <TableCell className='text-right'>
                    <AssignStudentClass student={student} onAssignmentSuccess={mutate} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => prev + 1)}
              disabled={!studentsData?.students || studentsData.students.length < pageSize}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}