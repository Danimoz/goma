/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { fetcher } from '@/lib/utils';
import { useState } from 'react'
import useSWR from 'swr'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useDebounce } from 'use-debounce';
import { Input } from './ui/Input';
import AssignTeacherClasses from './assign-teacher-classes';

export default function TeachersList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 1000);
  const { data: teachersData, error: teachersError, isLoading: teachersLoading } = useSWR(`/api/users/teachers?page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`, fetcher)

  function showAllClasses(classes: any[]) {
    if (!classes || classes.length === 0) {
      return '';
    }
    return classes.map(singleClass => singleClass.name).join(', ');
  }

  return (
    <div className='mt-4'>
      {teachersLoading ? <div className='p-4'>Loading...</div> : (
        <div>
          <div className="flex justify-end relative">
            <Input
              type="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-1/4 pr-6 border rounded"
            />
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
              {teachersData.teachers?.map((teacher: any) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher?.user?.firstName} {teacher?.user?.lastName}</TableCell>
                  <TableCell>{teacher?.user?.email}</TableCell>
                  <TableCell>{showAllClasses(teacher?.classes)}</TableCell>
                  <TableCell className='text-right'>
                    <AssignTeacherClasses teacher={teacher} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}