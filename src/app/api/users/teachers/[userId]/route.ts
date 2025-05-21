import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface ParamProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: Request, { params }: ParamProps) {
  const { userId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  try {
    const response = await prisma.teacher.findFirst({
      where: { 
        user: {
          email: userId
        }
      }
    })
    return Response.json(response, { status: 200 }) ;
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return Response.json({ error: "Failed to fetch teacher data" }, { status: 500 });
  }
}