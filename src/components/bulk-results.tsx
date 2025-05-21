/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Plus, Save } from "lucide-react";
import { Button } from "./ui/Button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { TStudentWithResults } from "@/types/interfaces";
import { Subject, Term } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { Input } from "./ui/Input";
import { useEffect, useState } from "react";
import useAcademicYear from "@/hooks/use-academic-year";
import { toast } from "sonner";
import { AddResultForStudent, addResultForStudent } from "@/actions/academic-year";

interface BulkResultsProps {
  classStudents?: TStudentWithResults[];
  updateClassStudent: () => void;
  classId: string
}

export default function BulkResults({ classStudents, updateClassStudent, classId }: BulkResultsProps) {
  const { academicYearId } = useAcademicYear();
  const { data: subjects, error: subjectsError, isLoading: subjectsLoading } = useSWR<Subject[]>(`/api/class/subjects`, fetcher);
  const { data: terms, error: termsError, isLoading: termsLoading } = useSWR<Term[]>(`/api/class/terms?academicSessionId=${academicYearId}`, fetcher);
  const [studentMarks, setStudentMarks] = useState<{ [key: string]: number }>({});
  const [studentGrades, setStudentGrades] = useState<{ [key: string]: string }>({});
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingData = subjectsLoading || termsLoading || isLoading;

  useEffect(() => {
    if (classStudents) {
      const initialMarks: { [key: string]: number } = {};
      const initialGrades: { [key: string]: string } = {};
      classStudents?.forEach((student) => {
        // Assuming you want to initialize with existing marks if available
        const termSubjectResult = student.Result?.find((result) => {
          return result.termId === selectedTermId && result.subjectId === selectedSubjectId;
        });
        initialMarks[student.id] = termSubjectResult ? termSubjectResult.score : 0; // Default to 0 if no marks
        initialGrades[student.id] = termSubjectResult ? termSubjectResult.grade : "N/A"; // Default to "N/A" if no grade
      });
      setStudentMarks(initialMarks);
      setStudentGrades(initialGrades);
    }
  }, [classStudents, selectedSubjectId, selectedTermId]);

  async function handleSaveResults() {
    setIsLoading(true);
    if (!selectedSubjectId || !selectedTermId) {
      toast.error("Please select a subject and term.");
      return;
    }
    const results = classStudents?.map((student) => ({
      studentId: student.id,
      score: studentMarks[student.id],
      grade: studentGrades[student.id],
    }));

    const result = await addResultForStudent({
      results,
      classId,
      subjectId: selectedSubjectId,
      termId: selectedTermId,
      academicSessionId: academicYearId as string,
    } as AddResultForStudent);

    if (result && !("error" in result)) {
      toast.success("Results saved successfully.");
      updateClassStudent();
    } else {
      toast.error((result as any)?.error || "Failed to save results.");
    }
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Enter Bulk Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[8-vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="">
          <DialogTitle className="text-xl font-bold">Enter Results</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Select onValueChange={(value) => setSelectedSubjectId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Term</label>
            <Select onValueChange={(value) => setSelectedTermId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {terms?.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedSubjectId && selectedTermId ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enter Student Marks</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-congress-blue-100">
                    <TableHead className="w-[250px]">STUDENT</TableHead>
                    <TableHead>MARKS (OUT OF 100)</TableHead>
                    <TableHead>GRADE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback className="bg-congress-blue-500 text-white rounded-full">
                            {student.user.firstName.charAt(0)} {student.user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {student.user.firstName} {student.user.lastName}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={studentMarks[student.id]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setStudentMarks((prev) => ({
                              ...prev,
                              [student.id]: isNaN(value) ? 0 : value,
                            }));
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={studentGrades[student.id]}
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudentGrades((prev) => ({
                              ...prev,
                              [student.id]: value,
                            }));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>              
              <div className="flex justify-end items-center mt-6 gap-4">
                <Button className="bg-congress-blue-600 hover:bg-congress-blue-700" onClick={handleSaveResults} disabled={isLoadingData || isLoading || !selectedSubjectId || !selectedTermId}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Results"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Select a subject and term to enter results.</p>
            <p className="text-sm">Results will be saved for the selected subject and term.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}