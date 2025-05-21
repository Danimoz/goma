'use client';

import { Gender, Role } from "@prisma/client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog"
import { Button } from "./ui/Button"
import { Plus } from "lucide-react"
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Checkbox } from "./ui/Checkbox";
import { createUser } from "@/actions/users";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Class } from "@prisma/client";
import useAcademicYear from "@/hooks/use-academic-year";

interface CreateUserFormProps {
  class?: Class
 onSuccessCallback?: () => void
}

export default function CreateUserForm({ class: singleClass, onSuccessCallback }: CreateUserFormProps) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<Role>(Role.STUDENT)
  const [isLoading, setIsLoading] = useState(false)
  const { academicYearId } = useAcademicYear();
  const { data: classesData } = useSWR(`api/class?academicSessionId=${academicYearId}`, fetcher);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    data.role = role
    const res = await createUser(data)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("User created successfully")
      setIsLoading(false)
      setOpen(false)
    }
    setIsLoading(false)
    if (onSuccessCallback) onSuccessCallback()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Enter user details to create a new account in the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name='lastName' required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name='email' />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={Role.STUDENT}>Student</SelectItem>
                <SelectItem value={Role.TEACHER}>Teacher</SelectItem>
                <SelectItem value={Role.ADMIN}>Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role !== Role.STUDENT && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name='password' required />
            </div>
          )}

          {(role === Role.STUDENT || role === Role.TEACHER) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name='gender' defaultValue={Gender.MALE}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required />
              </div>
            </>
          )}
          {role === Role.STUDENT && classesData && (
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                name='classId'
                // Prioritize singleClass prop for default selection, fallback to first in list
                defaultValue={singleClass?.id ?? classesData.classes?.[0]?.id}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {classesData?.map((cls: Class) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {role === Role.ADMIN && (
            <div className="flex items-center space-x-2">
              <Checkbox id="isSuperAdmin" name="superAdmin" />
              <Label htmlFor="isSuperAdmin">Super Admin</Label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}