import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  try {
    const sessions = await prisma.academicSession.findMany({})
    return Response.json(sessions, { status: 200 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'An error occured' }, { status: 200 })
  }
}