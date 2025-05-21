'use server';

import { prisma } from "@/lib/prisma";
import { getCurrentAcademicSession } from "@/lib/utils";
import { TermType } from "@prisma/client";

export async function getOrCreateAcademicYear() {
  const currentAcademicYear = getCurrentAcademicSession();
  const [yearStart, yearEnd] = currentAcademicYear?.split('-') ?? ['', ''];

  try {
    // Check if the academic year already exists in the database
    const existingAcademicYear = await prisma.academicSession.findFirst({
      where: {
        startYear: yearStart,
        endYear: yearEnd ,
      },
    });
  
    if (existingAcademicYear) {
      return existingAcademicYear;
    }

    // If it doesn't exist, create a new academic year
    const newAcademicYear = await prisma.academicSession.create({
      data: {
        startYear: yearStart,
        endYear: yearEnd,
        name: `${yearStart}-${yearEnd}`,
      }
    });

    if (newAcademicYear){
      // create first term, second term and third term
      await prisma.term.createMany({
        data: [
          { name: TermType.FIRST, academicSessionId: newAcademicYear.id },
          { name: TermType.SECOND, academicSessionId: newAcademicYear.id },
          { name: TermType.THIRD, academicSessionId: newAcademicYear.id },
        ]
      });
    }

    return newAcademicYear;
  } catch (error) {
    console.error("Error fetching academic year:", error);
    return null;
  }
}

export async function createClassForAcademicYear(academicSessionId: string, className: string) {
  try {
    const newClass = await prisma.class.create({
      data: {
        name: className,
        academicSessionId,
      }
    });
    return newClass;
  } catch (error) {
    console.error("Error creating class:", error);
    return null;
  }
}

export async function createSubject(name: string){
  try {
    const newSubject = await prisma.subject.create({
      data: {
        name,
      }
    });
    return newSubject;
  } catch (error) {
    console.error("Error creating subject:", error);
    return { error: "Failed to create subject" };
  }
}


export interface AddResultForStudent {
  subjectId: string;
  termId: string;
  academicSessionId: string;
  classId: string;
  results: {
    studentId: string;
    score: number;
    grade: string;
  }[]
}

export async function addResultForStudent(
  { results, subjectId, termId, academicSessionId, classId }: AddResultForStudent
) {
  try {
    const operations = results.map((result) => {
      return prisma.result.upsert({
        where: {
          studentId_termId_subjectId: {
            studentId: result.studentId, termId, subjectId 
          }
        },
        update: {
          score: result.score,
          grade: result.grade,
        },
        create: {
          studentId: result.studentId,
          termId,
          subjectId,
          classId,
          academicSessionId,
          score: result.score,
          grade: result.grade,
        },
      })
    });

    const transactionResults = await prisma.$transaction(operations);
    return transactionResults;
  } catch (error) {
    console.error("Error adding result:", error);
    return null;
  }
}