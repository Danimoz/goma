/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { Input } from "./ui/Input"; // Added Input
import { cn, fetcher } from "@/lib/utils";
import { toast } from "sonner";
import CreateUserForm from "./create-user-form";
import { Class } from "@prisma/client"; // Added Role
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { assignClassToStudent } from "@/actions/users"; // Added
import { TStudent } from "@/types/interfaces";

interface AddStudentsToClassProps {
  class: Class;
  onStudentsUpdated: () => void;
}

export default function AddStudentsToClass({ class: singleClass, onStudentsUpdated }: AddStudentsToClassProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const { data: studentsApiResponse, error: studentsError, isLoading: studentsLoading, mutate: mutateStudents } = useSWR(
    // Fetch all if search is empty, otherwise search
    `/api/users/students?pageSize=30&search=${debouncedSearch}&excludeClassId=${singleClass.id}`,
    fetcher
  );
  const [isLoadingAction, setIsLoadingAction] = useState(false); // For assign/create actions
  const [showCreateNewStudentTrigger, setShowCreateNewStudentTrigger] = useState(false);

  const studentsToDisplay: TStudent[] = useMemo(() => studentsApiResponse?.students || [], [studentsApiResponse]);

  useEffect(() => {
    if (!studentsLoading && debouncedSearch && studentsToDisplay.length === 0) {
      setShowCreateNewStudentTrigger(true);
    } else {
      setShowCreateNewStudentTrigger(false);
    }
  }, [studentsLoading, debouncedSearch, studentsToDisplay]);

  const handleAssignSelectedStudent = async () => {
    if (!selectedStudentId) {
      toast.error("No student selected.");
      return;
    }
    setIsLoadingAction(true);
    try {
      const result = await assignClassToStudent(selectedStudentId, singleClass.id);
      // Assuming result is { error: string } on failure, or the updated record on success
      if (result && !('error' in result)) {
        toast.success("Student assigned successfully.");
        onStudentsUpdated();
        mutateStudents(); // Re-fetch student list
        setOpen(false);
      } else {
        toast.error((result as any)?.error || "Failed to assign student.");
      }
    } catch (err) {
      toast.error("An error occurred.");
      console.error(err);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Reset search and selection when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchValue("");
      setSelectedStudentId(null);
      setShowCreateNewStudentTrigger(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Student to Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student to Class: {singleClass.name}</DialogTitle>
          <DialogDescription>
            Search for an existing student or create a new one to add.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search students by name or email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="my-2"
        />

        <div className="max-h-60 overflow-y-auto pr-1 space-y-1 mb-4">
          {studentsLoading && <p className="text-center text-muted-foreground">Loading students...</p>}
          {!studentsLoading && studentsToDisplay.length > 0 && (
            studentsToDisplay.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={cn(
                  "p-1.5 rounded-md cursor-pointer border hover:border-primary hover:bg-accent transition-colors",
                  selectedStudentId === student.id ? "bg-primary text-primary-foreground border-primary" : "border-transparent"
                )}
              >
                {student.user.firstName} {student.user.lastName || ''}
                {student.user.email && <span className="text-xs text-muted-foreground block sm:inline sm:ml-2">({student.user.email})</span>}
              </div>
            ))
          )}
          {!studentsLoading && studentsToDisplay.length === 0 && !showCreateNewStudentTrigger && debouncedSearch && (
            <p className="text-center text-muted-foreground">No students found matching &ldquo;{debouncedSearch}&rdquo;. Try a different search.</p>
          )}
          {!studentsLoading && studentsToDisplay.length === 0 && !debouncedSearch && (
            <p className="text-center text-muted-foreground">No students found. Type to search or create a new student.</p>
          )}
        </div>

        {showCreateNewStudentTrigger && !studentsLoading && (
          <div className="my-4 p-4 border border-dashed rounded-md text-center">
            <p className="mb-2 text-muted-foreground">No student found matching &ldquo;{debouncedSearch}&rdquo;.</p>
            {/* This CreateUserForm will act as a trigger button opening its own dialog */}
            <CreateUserForm
              class={singleClass} // Pass class to assign upon creation
              // Callbacks after CreateUserForm successfully creates and assigns a user
              onSuccessCallback={() => {
                onStudentsUpdated(); // Your existing callback
                mutateStudents();   // Re-fetch students in this component
                setOpen(false);     // Close this AddStudentsToClass dialog
              }}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoadingAction}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignSelectedStudent}
            disabled={!selectedStudentId || isLoadingAction || showCreateNewStudentTrigger}
          >
            {isLoadingAction ? "Assigning..." : "Add Selected Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}