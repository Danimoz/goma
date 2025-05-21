/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function createUser(data: Record<string, any>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { firstName, lastName, email, password, role, superAdmin, address, gender, classId } = data;
  if (!firstName || !lastName || !role) {
    return { error: "First name, last name and role are required" }
  }
  try {
    let existingUser;

    if (email) {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } else {
      existingUser = await prisma.user.findFirst({
        where: { firstName, lastName },
      });
    }
    if (existingUser) {
      const identifier = email ? `email ${email}` : `name ${firstName} ${lastName}`;
      return { error: `User already exists with ${identifier}` }
    }

    let hashedPassword: string | undefined;
    if (password && role !== 'STUDENT') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          ...(email ? { email } : {}),
          ...(password ? { password: hashedPassword } : {}),
          role,
          ...(superAdmin ? { superAdmin } : {}),
          ...(session?.user.role === 'ADMIN' ? { approved: true } : {}),
          createdBy: session.user.email
        },
        select: { id: true, firstName: true, lastName: true, email: true, role: true },
      });

      if (role === 'STUDENT') {
        await tx.student.create({
          data: {
            userId: user.id,
            gender,
            address,
            classId
          }
        });
      }
      if (role === 'TEACHER') {
        await tx.teacher.create({
          data: {
            userId: user.id,
            gender,
            address
          }
        });
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Could not create user" }
  }
}


export async function assignClassToTeacher(teacherId: string, academicSessionId: string, classesId: string[]){
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  try {
    return await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        classes: {
          connect: classesId.map((classId) => ({ id: classId })),
        }
      },
    });
  } catch (error) {
    console.error("Error assigning class to teacher:", error);
    return { error: "Could not assign class to teacher" }
  }
}

export async function assignClassToStudent(studentId: string, classId: string){
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  try {
    return await prisma.student.update({
      where: { id: studentId },
      data: {
        class: { connect: { id: classId } },
      },
    });
  } catch (error) {
    console.error("Error assigning class to student:", error);
    return { error: "Could not assign class to student" }
  }
}