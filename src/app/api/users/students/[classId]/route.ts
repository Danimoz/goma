import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface ParamProps {
  params: Promise<{
    classId: string;
  }>;
}

export async function GET(request: Request, { params }: ParamProps) {
  const { classId } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  try {
    const students = await prisma.student.findMany({
      where: { classId },
      include: {
        user: { 
          select: { firstName: true, lastName: true, email: true }
        },
        Result: true
      }
    })

    return Response.json(students, { status: 200 });
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Something occured'}, { status: 500 })
  }
}