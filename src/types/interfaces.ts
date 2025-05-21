import { Class, Result, Student, Subject, Term, User } from "@prisma/client";

export type TStudent = Student & {
  user: Pick<User, "firstName" | "lastName" | "email">;
} & {
  class: Pick<Class, "name">
}

export type TStudentWithResults = Student & {
  user: Pick<User, "firstName" | "lastName" | "email">;
} & {
  Result: Result[]
}

export type StudentResults = Result & {
  term: Term
} & {
  subject: Subject
}

export interface TStudentTermResults {
  [key: string]: StudentResults[]
}