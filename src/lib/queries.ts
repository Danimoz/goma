/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "./prisma";

export async function getTeachers(page: number = 1, pageSize: number = 10, search?: string) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const teachers = await prisma.teacher.findMany({
      skip,
      take,
      ...(search ? {
        where: {
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      } : {}),
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, }
        },
        classes: {
          select: { name: true }
        }
      },
      orderBy: {
        user: {
          lastName: 'asc'
        }
      }
    });

    const totalTeachers = await prisma.teacher.count();

    return {
      teachers,
      totalPages: Math.ceil(totalTeachers / pageSize),
      currentPage: page,
      totalTeachers
    };
  }
  catch (error) {
    console.error("Error fetching teachers:", error);
    return { teachers: [], totalPages: 0, currentPage: 1, totalTeachers: 0 };
  }
}

export async function getStudents(page: number = 1, pageSize: number = 10, search?: string, excludeClassId?: string) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const whereConditions: any = {};

    if (search) {
      whereConditions.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    if (excludeClassId) {
      whereConditions.classId = { not: excludeClassId };
    }

    const students = await prisma.student.findMany({
      skip,
      take,
      where: whereConditions,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        class: { select: { name: true } }
      },
      orderBy: {
        user: {
          lastName: 'asc'
        }
      }
    });

    const totalStudents = await prisma.student.count({
      where: whereConditions
    });

    return {
      students,
      totalPages: Math.ceil(totalStudents / pageSize),
      currentPage: page,
      totalStudents
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { students: [], totalPages: 0, currentPage: 1, totalStudents: 0 };
  }
}

export async function getAdmins(page: number = 1, pageSize: number = 10, search?: string) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const admins = await prisma.user.findMany({
      where: {
        AND: [
          { role: 'ADMIN' },
          ...(search ? [{
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } }
            ]
          }] : [])
        ]
      },
      skip,
      take,
      orderBy: {
        lastName: 'asc'
      }
    });

    const totalAdmins = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    return {
      admins,
      totalPages: Math.ceil(totalAdmins / pageSize),
      currentPage: page,
      totalAdmins
    };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return { admins: [], totalPages: 0, currentPage: 1, totalAdmins: 0 };
  }
}

export async function getClassByAcademicSession(academicSessionId: string, teacherId?: string) {
  try {
    const classes = await prisma.class.findMany({
      where: {
        academicSessionId,
        ...(teacherId ? {
          teacher: { user: { email: teacherId } }
        } : {})
      },
    });
    return classes;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
}