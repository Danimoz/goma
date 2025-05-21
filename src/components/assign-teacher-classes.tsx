/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { cn, fetcher, getCurrentAcademicSession } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import useAcademicYear from "@/hooks/use-academic-year";
import useSWR from "swr";
import { Class } from "@prisma/client";
import { createClassForAcademicYear } from "@/actions/academic-year";
import { assignClassToTeacher } from "@/actions/users";
import { toast } from "sonner";

export default function AssignTeacherClasses({ teacher }: { teacher: any }) {
  const [open, setOpen] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { academicYearId } = useAcademicYear();
  const { data: defaultClasses, error: classesError, isLoading: classesLoading, mutate } = useSWR<Class[]>(`/api/class?academicSessionId=${academicYearId}`, fetcher);

  const availableClasses = useMemo(() => defaultClasses, [defaultClasses]);

  const classes = useMemo(() => availableClasses?.map((singleClass) => ({
    value: singleClass.id,
    label: singleClass.name,
  })), [availableClasses]);

  const handleAddAndSelectClass = async () => {
    if (searchValue && !availableClasses?.some(c => c.name === searchValue)) {
      const newClass = await createClassForAcademicYear(academicYearId as string, searchValue);
      if (newClass) {
        mutate([...(availableClasses || []), newClass])
        setSelectedClasses(prev => [...prev, newClass.id]);
        setSearchValue("");
      }
    }
  };

  async function handleAssign() {
    setIsLoading(true);
    const res = await assignClassToTeacher(teacher.id, academicYearId as string, selectedClasses);
    if ('error' in res) {
      toast.error("Cannot assign this teacher, Try again later")
    } else {
      toast.success("Assigned Succesfully")
      setOpen(false);
      setSelectedClasses([]);
      setPopoverOpen(false);
    }
    setIsLoading(false);
  }

  function getNamesOfSelectedIDs() {
    return selectedClasses.map((id) => {
      return availableClasses?.find((singleClass) => singleClass.id === id)?.name;
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign Classes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Classes to {teacher?.user?.firstName + " " + teacher?.user?.lastName}</DialogTitle>
          <DialogDescription>
            Select the classes you want to assign to this teacher for the {getCurrentAcademicSession()} academic session.
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
              {selectedClasses.length > 0 ? getNamesOfSelectedIDs().join(', ') : "Select classes..."}
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
                        setSelectedClasses(prev => {
                          if (prev.includes(currentValue)) {
                            return prev.filter(item => item !== currentValue);
                          } else {
                            return [...prev, currentValue];
                          }
                        });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClasses.includes(singleClass.value) ? "opacity-100" : "opacity-0"
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
        <Button onClick={handleAssign} className="mt-4" disabled={selectedClasses.length === 0 || isLoading}>
          Assign Class
        </Button>
      </DialogContent>
    </Dialog>
  )
}