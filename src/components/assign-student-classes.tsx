/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createClassForAcademicYear } from "@/actions/academic-year"
import useAcademicYear from "@/hooks/use-academic-year"
import { Class, Student, User } from "@prisma/client"
import { useMemo, useState } from "react"
import useSWR from "swr"
import { cn, fetcher, getCurrentAcademicSession } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { assignClassToStudent } from "@/actions/users"

interface AssignStudentClassProps {
  student: Student & {
    user: Pick<User, "firstName" | "lastName" | "email">
  } & {
    class: Pick<Class, "name">
  };
  onAssignmentSuccess: () => void;
}

export default function AssignStudentClass({ student, onAssignmentSuccess }: AssignStudentClassProps) {
  const [open, setOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { academicYearId } = useAcademicYear()
  const { data: defaultClasses, error: classesError, isLoading: classesLoading, mutate } = useSWR<Class[]>(`/api/class?academicSessionId=${academicYearId}`, fetcher);

  const availableClasses = useMemo(() => {
    return defaultClasses?.filter((singleClass) => {
      return singleClass.name.toLowerCase().startsWith("pr") || singleClass.name.toLowerCase().startsWith("k") || singleClass.name.toLowerCase().startsWith("n") || singleClass.name.toLowerCase().startsWith("j") || singleClass.name.toLowerCase().startsWith("s")
    })
  }, [defaultClasses]);

  const classes = useMemo(() => availableClasses?.map((singleClass) => ({
    value: singleClass.id,
    label: singleClass.name,
  })), [availableClasses]);

  const handleAddAndSelectClass = async () => {
    if (searchValue && !availableClasses?.some(c => c.name === searchValue)) {
      const newClass = await createClassForAcademicYear(academicYearId as string, searchValue);
      if (newClass) {
        mutate([...(availableClasses || []), newClass])
        setSelectedClass(newClass.id);
        setSearchValue("");
      }
    }
  };

  const handleAssign = async () => {
    setIsLoading(true);
    const res = await assignClassToStudent(student.id, selectedClass as string);
    if ('error' in res) {
      toast.error("Cannot assign this student, Try again later")
    } else {
      toast.success("Assigned Succesfully")
      onAssignmentSuccess();
      setOpen(false);
      setSelectedClass(null);
      setPopoverOpen(false);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Class to {student?.user?.firstName + " " + student?.user?.lastName}</DialogTitle>
          <DialogDescription>
            Select the class you want to assign to this student for the {getCurrentAcademicSession()} academic session.
          </DialogDescription>
        </DialogHeader>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="w-[200px] line-clamp-1 justify-between"
            >
              {selectedClass ? availableClasses?.find((singleClass) => singleClass.id === selectedClass)?.name : "Select classes..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-background" >
            <Command>
              <CommandInput placeholder="Search classes..." value={searchValue} onValueChange={setSearchValue} />
              <CommandList>
                <CommandEmpty>
                  {searchValue ? (
                    <Button size="sm" className="w-full" onClick={handleAddAndSelectClass}>
                      Add & Select &ldquo;{searchValue}&rdquo;
                    </Button>
                  ) : "No classes found."}
                </CommandEmpty>
                <CommandGroup>
                  {classes?.map((singleClass) => (
                    <CommandItem
                      key={singleClass.value}
                      value={singleClass.value}
                      onSelect={(currentValue) => {
                        setSelectedClass(currentValue)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClass === (singleClass.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {singleClass.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={handleAssign} className="mt-4" disabled={!selectedClass || isLoading}>
          Assign Class
        </Button>
      </DialogContent>
    </Dialog>
  )
}