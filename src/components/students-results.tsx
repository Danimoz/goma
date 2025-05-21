'use client';

import { TStudentTermResults } from "@/types/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/Button";
import { PrinterIcon } from "lucide-react";

interface StudentResultsProps {
  term: 'FIRST' | 'SECOND' | 'THIRD';
  results?: TStudentTermResults
}
const resultMatcher = {
  'FIRST': 'firstTermResults',
  'SECOND': 'secondTermResults',
  'THIRD': 'thirdTermResults'
} as const;

export default function StudentResults({ term, results }: StudentResultsProps) {
  const termResult = results?.[resultMatcher[term]]

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handlePrint} variant="outline">
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print Results
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left font-semibold">SUBJECT</TableHead>
            <TableHead className="text-left font-semibold">SCORE</TableHead>
            <TableHead className="text-left font-semibold">GRADE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {termResult?.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="text-left font-semibold">{result.subject.name}</TableCell>
              <TableCell>{result.score}</TableCell>
              <TableCell>{result.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
