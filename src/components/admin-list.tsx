/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { fetcher } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { useDebounce } from 'use-debounce';
import { User } from "@prisma/client";


export default function AdminsList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 1000);
  const { data: adminsData, error: adminsError, isLoading: adminsLoading } = useSWR(`/api/users/admins?page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`, fetcher)

  return (
    <div className="mt-4">
      {adminsLoading ? <div className='p-4'>Loading...</div> : (
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
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminsData?.admins?.map((admin: Omit<User, 'password'>) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin?.firstName} {admin.lastName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.isSuperAdmin ? "Super Admin" : "Admin"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}