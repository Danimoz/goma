import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const searchParams = request.nextUrl.searchParams
  const academicSessionId = searchParams.get("academicSessionId");

  if (!academicSessionId) {
    return Response.json({ error: "Academic session ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email as string },
      include: {
        Student: true
      }
    })

    const res = await prisma.result.findMany({
      where: {
        studentId: user?.Student?.id,
        academicSessionId
      },
      include: { term: true, subject: true }
    })

    const firstTermResults = res?.filter((result) => result.term.name === 'FIRST')
    const secondTermResults = res?.filter((result) => result.term.name === 'SECOND')
    const thirdTermResults = res?.filter((result) => result.term.name === 'THIRD')
    
    const result = {
      firstTermResults,
      secondTermResults,
      thirdTermResults
    }

    return Response.json(result, { status: 200 })
  } catch(err){
    console.error(err)
    return Response.json({'error': "An error occured"}, { status: 500 })
  }
}